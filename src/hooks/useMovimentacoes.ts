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
        .order("data", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Movimentacao[];
    },
    enabled: !!user,
  });

  // Helper function to get current stock for a product
  const getProductStock = async (produtoId: string): Promise<number> => {
    const { data: movimentacoes, error } = await supabase
      .from("movimentacoes")
      .select("tipo, quantidade")
      .eq("produto_id", produtoId);

    if (error) throw error;

    return movimentacoes.reduce((acc, mov) => {
      if (mov.tipo === "entrada") {
        return acc + mov.quantidade;
      } else {
        return acc - mov.quantidade;
      }
    }, 0);
  };

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
      // Validate positive quantity
      if (quantidade <= 0) {
        throw new Error("A quantidade deve ser maior que zero");
      }

      // If it's an exit, check stock availability
      if (tipo === "saida") {
        const currentStock = await getProductStock(produto_id);
        if (currentStock < quantidade) {
          throw new Error(
            `Saldo insuficiente. Saldo atual: ${currentStock} unidade(s)`
          );
        }
      }

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
      toast.error(error.message);
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
    getProductStock,
  };
};
