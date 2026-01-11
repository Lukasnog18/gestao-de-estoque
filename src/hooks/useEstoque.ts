import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface EstoqueItem {
  produto_id: string;
  produto_nome: string;
  saldo: number;
}

export const useEstoque = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["estoque"],
    queryFn: async () => {
      // Get all products
      const { data: produtos, error: produtosError } = await supabase
        .from("produtos")
        .select("id, nome")
        .order("nome");

      if (produtosError) throw produtosError;

      // Get all movements
      const { data: movimentacoes, error: movError } = await supabase
        .from("movimentacoes")
        .select("produto_id, tipo, quantidade");

      if (movError) throw movError;

      // Calculate stock for each product
      const estoque: EstoqueItem[] = produtos.map((produto) => {
        const produtoMovs = movimentacoes.filter(
          (m) => m.produto_id === produto.id
        );

        const saldo = produtoMovs.reduce((acc, mov) => {
          if (mov.tipo === "entrada") {
            return acc + mov.quantidade;
          } else {
            return acc - mov.quantidade;
          }
        }, 0);

        return {
          produto_id: produto.id,
          produto_nome: produto.nome,
          saldo,
        };
      });

      return estoque;
    },
    enabled: !!user,
  });

  const totalProdutos = query.data?.length ?? 0;
  const emEstoque = query.data?.filter((item) => item.saldo > 5).length ?? 0;
  const estoqueBaixo = query.data?.filter((item) => item.saldo > 0 && item.saldo <= 5).length ?? 0;
  const zerado = query.data?.filter((item) => item.saldo <= 0).length ?? 0;

  return {
    estoque: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    totalProdutos,
    emEstoque,
    estoqueBaixo,
    zerado,
  };
};
