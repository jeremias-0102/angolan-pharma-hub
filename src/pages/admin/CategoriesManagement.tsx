
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Edit, Trash2, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/models';
import { getAllCategories, deleteCategory, isCategoryInUse } from '@/services/categoryService';
import { useToast } from '@/components/ui/use-toast';
import CategoryFormModal from '@/components/admin/CategoryFormModal';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar categorias.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openForm = (category?: Category) => {
    setCurrentCategory(category || null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentCategory(null);
  };

  const saveCategory = async (categoryData: Category) => {
    // This function will be implemented in the CategoryFormModal
    // It will handle both creation and update of categories
    
    // Update the local state with the new/updated category
    if (categoryData.id) {
      setCategories(prev => prev.map(cat => cat.id === categoryData.id ? categoryData : cat));
    } else {
      setCategories(prev => [...prev, categoryData]);
    }
    
    closeForm();
    
    toast({
      title: categoryData.id ? "Categoria atualizada" : "Categoria criada",
      description: `A categoria ${categoryData.name} foi ${categoryData.id ? 'atualizada' : 'criada'} com sucesso.`
    });
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      // Check if the category is in use
      const isInUse = await isCategoryInUse(categoryToDelete.id);
      
      if (isInUse) {
        toast({
          title: "Não foi possível excluir",
          description: "Esta categoria está sendo usada por um ou mais produtos.",
          variant: "destructive"
        });
        return;
      }
      
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      
      toast({
        title: "Categoria excluída",
        description: `A categoria ${categoryToDelete.name} foi excluída com sucesso.`
      });
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir categoria.",
        variant: "destructive"
      });
    } finally {
      closeDeleteDialog();
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Gestão de Categorias</h1>
        </div>
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Categoria
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Buscar categoria por nome ou descrição..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Carregando categorias...
                </TableCell>
              </TableRow>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={category.is_active ? "default" : "outline"} 
                      className={category.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800"}
                    >
                      {category.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openForm(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(category)}>
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
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                  {searchQuery ? 'Nenhuma categoria encontrada para esta pesquisa.' : 'Nenhuma categoria cadastrada.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={saveCategory}
        category={currentCategory}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteCategory}
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir a categoria ${categoryToDelete?.name}? Esta ação não poderá ser desfeita.`}
      />
    </div>
  );
};

export default CategoriesManagement;
