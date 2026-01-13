import { useState } from "react";
import { Plus, Package, Search, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useProdutos, Produto } from "@/hooks/useProdutos";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { useEstoque } from "@/hooks/useEstoque";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Produtos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [search, setSearch] = useState("");

  const { produtos, isLoading, createProduto, updateProduto, deleteProduto, isCreating, isUpdating, isDeleting } = useProdutos();
  const { movimentacoes } = useMovimentacoes();
  const { estoque } = useEstoque();

  // Check if a product has movements
  const productHasMovements = (produtoId: string) => {
    return movimentacoes.some((m) => m.produto_id === produtoId);
  };

  // Get stock for a product
  const getProductStock = (produtoId: string) => {
    return estoque.find((item) => item.produto_id === produtoId)?.saldo ?? 0;
  };

  const filteredProdutos = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto);
      setNome(produto.nome);
      setDescricao(produto.descricao ?? "");
    } else {
      setEditingProduto(null);
      setNome("");
      setDescricao("");
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!nome.trim()) return;

    if (editingProduto) {
      updateProduto({ id: editingProduto.id, nome, descricao });
    } else {
      createProduto({ nome, descricao });
    }
    setIsDialogOpen(false);
    setNome("");
    setDescricao("");
    setEditingProduto(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteProduto(deletingId);
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    // Check if product has movements before opening dialog
    if (productHasMovements(id)) {
      toast.error("Não é possível excluir um produto que possui movimentações. Exclua as movimentações primeiro.");
      return;
    }
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o cadastro de produtos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduto ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nome do produto</Label>
                <Input
                  id="productName"
                  placeholder="Ex: Parafuso Phillips 6mm"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription">Descrição</Label>
                <Textarea
                  id="productDescription"
                  placeholder="Descrição detalhada do produto..."
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isCreating || isUpdating || !nome.trim()}>
                {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProdutos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {search
                  ? "Tente buscar com outros termos."
                  : "Adicione seu primeiro produto clicando no botão acima para começar a gerenciar seu estoque."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredProdutos.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {produto.nome}
                    </h4>
                    {produto.descricao && (
                      <p className="text-sm text-muted-foreground truncate">
                        {produto.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Criado em {format(new Date(produto.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        Saldo: {getProductStock(produto.id)}
                      </Badge>
                      {productHasMovements(produto.id) && (
                        <Badge variant="secondary" className="text-xs">
                          Com movimentações
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(produto)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(produto.id)}
                      disabled={productHasMovements(produto.id)}
                      title={productHasMovements(produto.id) ? "Produto possui movimentações" : "Excluir produto"}
                    >
                      <Trash2 className={`h-4 w-4 ${productHasMovements(produto.id) ? "text-muted-foreground" : "text-destructive"}`} />
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
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isDeleting}>
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Produtos;
