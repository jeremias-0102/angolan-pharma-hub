
import React, { useState } from 'react';
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

// Mock data - would be replaced with API calls in production
const initialProducts: Product[] = [
  {
    id: '1',
    code: 'MED-001',
    name: 'Paracetamol 500mg',
    description: 'Analgésico e antipirético para alívio de dores leves e moderadas.',
    price_cost: 200,
    price_sale: 350,
    category: 'analgésicos',
    manufacturer: 'Pharma Inc.',
    requiresPrescription: false,
    image: '/images/paracetamol.jpg',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T10:30:00Z',
    batches: [
      {
        id: '101',
        product_id: '1',
        batch_number: 'B2023-001',
        quantity: 150,
        manufacture_date: '2022-12-01T00:00:00Z',
        expiry_date: '2024-12-01T00:00:00Z',
        created_at: '2023-01-15T10:30:00Z',
      }
    ]
  },
  {
    id: '2',
    code: 'MED-002',
    name: 'Amoxicilina 500mg',
    description: 'Antibiótico para tratamento de infecções bacterianas.',
    price_cost: 400,
    price_sale: 650,
    category: 'antibióticos',
    manufacturer: 'MedLab Angola',
    requiresPrescription: true,
    image: '/images/amoxicilina.jpg',
    created_at: '2023-01-20T14:45:00Z',
    updated_at: '2023-01-20T14:45:00Z',
    batches: [
      {
        id: '102',
        product_id: '2',
        batch_number: 'B2023-002',
        quantity: 80,
        manufacture_date: '2022-11-15T00:00:00Z',
        expiry_date: '2024-11-15T00:00:00Z',
        created_at: '2023-01-20T14:45:00Z',
      }
    ]
  },
  {
    id: '3',
    code: 'MED-003',
    name: 'Ibuprofeno 400mg',
    description: 'Anti-inflamatório não esteroidal para dor e inflamação.',
    price_cost: 250,
    price_sale: 420,
    category: 'anti-inflamatórios',
    manufacturer: 'Pharma Angola',
    requiresPrescription: false,
    image: '/images/ibuprofeno.jpg',
    created_at: '2023-02-05T09:15:00Z',
    updated_at: '2023-02-05T09:15:00Z',
    batches: [
      {
        id: '103',
        product_id: '3',
        batch_number: 'B2023-003',
        quantity: 120,
        manufacture_date: '2022-12-20T00:00:00Z',
        expiry_date: '2024-12-20T00:00:00Z',
        created_at: '2023-02-05T09:15:00Z',
      }
    ]
  },
];

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const { toast } = useToast();

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

  const handleSaveProduct = (product: Product) => {
    if (product.id) {
      // Update existing product
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === product.id ? product : p))
      );
      toast({
        title: "Produto atualizado",
        description: `${product.name} foi atualizado com sucesso.`,
      });
    } else {
      // Add new product with generated ID
      const newProduct = {
        ...product,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado com sucesso.`,
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productToDelete.id)
      );
      toast({
        title: "Produto excluído",
        description: `${productToDelete.name} foi excluído com sucesso.`,
      });
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
