import { Warehouse, Search, Package, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEstoque } from "@/hooks/useEstoque";
import { useState } from "react";

const Estoque = () => {
  const [search, setSearch] = useState("");
  const { estoque, isLoading, totalProdutos, emEstoque, estoqueBaixo, zerado } = useEstoque();

  const filteredEstoque = estoque.filter((item) =>
    item.produto_nome.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (saldo: number) => {
    if (saldo <= 0) {
      return (
        <Badge variant="outline" className="gap-1 bg-destructive/10 text-destructive border-destructive/20">
          <div className="h-2 w-2 rounded-full bg-destructive" />
          Zerado
        </Badge>
      );
    }
    if (saldo <= 5) {
      return (
        <Badge variant="outline" className="gap-1 bg-warning/10 text-warning border-warning/20">
          <div className="h-2 w-2 rounded-full bg-warning" />
          Baixo
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1 bg-success/10 text-success border-success/20">
        <div className="h-2 w-2 rounded-full bg-success" />
        Em estoque
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estoque</h1>
          <p className="text-muted-foreground mt-1">
            Visualize o saldo atual de cada produto
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1 py-1.5 px-3">
            <div className="h-2 w-2 rounded-full bg-success" />
            Em estoque
          </Badge>
          <Badge variant="outline" className="gap-1 py-1.5 px-3">
            <div className="h-2 w-2 rounded-full bg-warning" />
            Baixo
          </Badge>
          <Badge variant="outline" className="gap-1 py-1.5 px-3">
            <div className="h-2 w-2 rounded-full bg-destructive" />
            Zerado
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar no estoque..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
                <p className="text-3xl font-bold text-foreground">{totalProdutos}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Estoque</p>
                <p className="text-3xl font-bold text-success">{emEstoque}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Warehouse className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                <p className="text-3xl font-bold text-warning">{estoqueBaixo}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Zerados</p>
                <p className="text-3xl font-bold text-destructive">{zerado}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Saldo por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredEstoque.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Warehouse className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {search ? "Nenhum produto encontrado" : "Estoque vazio"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {search
                  ? "Tente buscar com outros termos."
                  : "Cadastre produtos e registre movimentações para visualizar o saldo do estoque."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredEstoque.map((item) => (
                <div
                  key={item.produto_id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {item.produto_nome}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Saldo: <span className="font-semibold">{item.saldo}</span> unidade(s)
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(item.saldo)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Estoque;
