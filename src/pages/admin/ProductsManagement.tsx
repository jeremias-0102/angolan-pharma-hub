
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/models";
import ProductFormModal from "@/components/admin/ProductFormModal";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import { 
  getAllProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct
} from '@/services/productService';

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar a lista de produtos.",
        });
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [toast]);

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.code.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.manufacturer.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openAddModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      if (product.id) {
        // Update existing product
        const updatedProduct = await updateProduct(product);
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        toast({
          title: "Produto atualizado",
          description: `${product.name} foi atualizado com sucesso.`,
        });
      } else {
        // Add new product
        const newProduct = await addProduct(product);
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        toast({
          title: "Produto adicionado",
          description: `${product.name} foi adicionado com sucesso.`,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar produto",
        description: "Ocorreu um erro ao salvar o produto.",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== productToDelete.id)
        );
        toast({
          title: "Produto excluído",
          description: `${productToDelete.name} foi excluído com sucesso.`,
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir produto",
          description: "Ocorreu um erro ao excluir o produto.",
        });
      }
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Calculate total stock for a product from all batches
  const getTotalStock = (product: Product) => {
    if (!product.batches || product.batches.length === 0) return 0;
    return product.batches.reduce((total, batch) => total + batch.quantity, 0);
  };

  // Format price to Angolan Kwanza
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Produtos</h1>
        <Button onClick={openAddModal} className="bg-pharma-primary hover:bg-pharma-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar produtos por nome, código, categoria..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-pharma-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando produtos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead>Preço de Venda</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Prescrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded border overflow-hidden">
                          <img
                            src={product.image || '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="capitalize">{product.category}</TableCell>
                      <TableCell>{product.manufacturer}</TableCell>
                      <TableCell>{formatPrice(product.price_sale)}</TableCell>
                      <TableCell>
                        {getTotalStock(product) > 10 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {getTotalStock(product)} unidades
                          </Badge>
                        ) : getTotalStock(product) > 0 ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            {getTotalStock(product)} unidades
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Sem estoque
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.requiresPrescription ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Necessária
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            Dispensável
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(product)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Nenhum produto encontrado. Tente outros termos de busca ou adicione um novo produto.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={currentProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Excluir Produto"
        description={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default ProductsManagement;
