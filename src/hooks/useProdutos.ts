import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Produto {
  id: string;
  user_id: string;
  nome: string;
  descricao: string | null;
  created_at: string;
}

export const useProdutos = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Produto[];
    },
    enabled: !!user,
  });

  // Helper function to check if product has movements
  const checkProductHasMovements = async (produtoId: string): Promise<boolean> => {
    const { count, error } = await supabase
      .from("movimentacoes")
      .select("id", { count: "exact", head: true })
      .eq("produto_id", produtoId);

    if (error) throw error;
    return (count ?? 0) > 0;
  };

  const createMutation = useMutation({
    mutationFn: async ({ nome, descricao }: { nome: string; descricao?: string }) => {
      if (!nome.trim()) {
        throw new Error("O nome do produto é obrigatório");
      }

      const { data, error } = await supabase
        .from("produtos")
        .insert({ nome: nome.trim(), descricao: descricao?.trim() || null, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Produto criado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, nome, descricao }: { id: string; nome: string; descricao?: string }) => {
      if (!nome.trim()) {
        throw new Error("O nome do produto é obrigatório");
      }

      const { data, error } = await supabase
        .from("produtos")
        .update({ nome: nome.trim(), descricao: descricao?.trim() || null })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      toast.success("Produto atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Check if product has movements
      const hasMovements = await checkProductHasMovements(id);
      if (hasMovements) {
        throw new Error("Não é possível excluir um produto que possui movimentações. Exclua as movimentações primeiro.");
      }

      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      toast.success("Produto excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    produtos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createProduto: createMutation.mutate,
    updateProduto: updateMutation.mutate,
    deleteProduto: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    checkProductHasMovements,
  };
};
