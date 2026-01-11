import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Movimentacao {
  id: string;
  user_id: string;
  produto_id: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
  created_at: string;
  produtos?: {
    nome: string;
  };
}

export const useMovimentacoes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["movimentacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movimentacoes")
        .select("*, produtos(nome)")
        .order("data", { ascending: false });

      if (error) throw error;
      return data as Movimentacao[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async ({
      produto_id,
      tipo,
      quantidade,
      data,
    }: {
      produto_id: string;
      tipo: "entrada" | "saida";
      quantidade: number;
      data: string;
    }) => {
      const { data: result, error } = await supabase
        .from("movimentacoes")
        .insert({ produto_id, tipo, quantidade, data, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimentacoes"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      toast.success("Movimentação registrada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao registrar movimentação: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("movimentacoes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimentacoes"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      toast.success("Movimentação excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir movimentação: " + error.message);
    },
  });

  return {
    movimentacoes: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createMovimentacao: createMutation.mutate,
    deleteMovimentacao: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
