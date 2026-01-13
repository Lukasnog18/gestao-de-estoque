import { useState } from "react";
import { Plus, ArrowRightLeft, ArrowUpCircle, ArrowDownCircle, Search, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { useProdutos } from "@/hooks/useProdutos";
import { useEstoque } from "@/hooks/useEstoque";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

const Movimentacoes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [produtoId, setProdutoId] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida" | "">("");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");

  const { movimentacoes, isLoading, createMovimentacao, deleteMovimentacao, isCreating } = useMovimentacoes();
  const { produtos } = useProdutos();
  const { estoque } = useEstoque();

  // Get stock for selected product
  const selectedProductStock = produtoId
    ? estoque.find((item) => item.produto_id === produtoId)?.saldo ?? 0
    : 0;

  const filteredMovimentacoes = movimentacoes.filter((m) => {
    const matchesSearch = m.produtos?.nome.toLowerCase().includes(search.toLowerCase());
    const matchesTipo = tipoFilter === "all" || m.tipo === tipoFilter;
    return matchesSearch && matchesTipo;
  });

  const handleSave = () => {
    if (!produtoId || !tipo || !quantidade || !data) return;

    const qty = parseInt(quantidade);
    
    if (qty <= 0) {
      return;
    }

    // Additional client-side validation for exits
    if (tipo === "saida" && qty > selectedProductStock) {
      return;
    }

    createMovimentacao(
      {
        produto_id: produtoId,
        tipo: tipo as "entrada" | "saida",
        quantidade: qty,
        data,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setProdutoId("");
          setTipo("");
          setQuantidade("");
          setData(format(new Date(), "yyyy-MM-dd"));
        },
      }
    );
  };

  const isQuantityInvalid = quantidade !== "" && parseInt(quantidade) <= 0;
  const isExitExceedsStock = tipo === "saida" && parseInt(quantidade || "0") > selectedProductStock;

  const handleDelete = () => {
    if (deletingId) {
      deleteMovimentacao(deletingId);
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground mt-1">
            Registre entradas e saídas de produtos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Movimentação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Movimentação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Select value={produtoId} onValueChange={(value) => {
                  setProdutoId(value);
                  setTipo("");
                  setQuantidade("");
                }}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Nenhum produto cadastrado
                      </SelectItem>
                    ) : (
                      produtos.map((produto) => {
                        const stock = estoque.find((item) => item.produto_id === produto.id)?.saldo ?? 0;
                        return (
                        <SelectItem key={produto.id} value={produto.id}>
                          <span className="flex items-center justify-between w-full gap-2">
                            {produto.nome}
                            <Badge variant="outline" className="text-xs">
                              Saldo: {stock}
                            </Badge>
                          </span>
                        </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de movimentação</Label>
                <Select value={tipo} onValueChange={(value) => setTipo(value as "entrada" | "saida")}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">
                      <div className="flex items-center gap-2">
                        <ArrowUpCircle className="h-4 w-4 text-success" />
                        Entrada
                      </div>
                    </SelectItem>
                    <SelectItem value="saida">
                      <div className="flex items-center gap-2">
                        <ArrowDownCircle className="h-4 w-4 text-destructive" />
                        Saída
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className={isQuantityInvalid || isExitExceedsStock ? "border-destructive" : ""}
                />
                {isQuantityInvalid && (
                  <p className="text-sm text-destructive">A quantidade deve ser maior que zero</p>
                )}
                {isExitExceedsStock && (
                  <p className="text-sm text-destructive">
                    Saldo insuficiente. Saldo atual: {selectedProductStock} unidade(s)
                  </p>
                )}
                {produtoId && tipo === "saida" && !isExitExceedsStock && (
                  <p className="text-sm text-muted-foreground">
                    Saldo disponível: {selectedProductStock} unidade(s)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isCreating || !produtoId || !tipo || !quantidade || !data || isQuantityInvalid || isExitExceedsStock}
              >
                {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar movimentações..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="entrada">Entradas</SelectItem>
            <SelectItem value="saida">Saídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Movements List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Histórico de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMovimentacoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <ArrowRightLeft className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {search || tipoFilter !== "all"
                  ? "Nenhuma movimentação encontrada"
                  : "Nenhuma movimentação registrada"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {search || tipoFilter !== "all"
                  ? "Tente buscar com outros termos ou filtros."
                  : "Registre entradas e saídas de produtos para manter o controle do seu estoque."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredMovimentacoes.map((mov) => (
                <div
                  key={mov.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        mov.tipo === "entrada"
                          ? "bg-success/10"
                          : "bg-destructive/10"
                      }`}
                    >
                      {mov.tipo === "entrada" ? (
                        <ArrowUpCircle className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {mov.produtos?.nome}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {mov.tipo === "entrada" ? "Entrada" : "Saída"} de{" "}
                        <span className="font-medium">{mov.quantidade}</span>{" "}
                        unidade(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(mov.data), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(mov.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Movimentacoes;
