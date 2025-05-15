
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Category } from '@/types/models';
import { createCategory, updateCategory } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category: Category | null;
}

const categorySchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }).max(50),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category
}) => {
  const { toast } = useToast();
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      is_active: category?.is_active ?? true,
    },
  });

  // Update form values when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        is_active: category.is_active,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        is_active: true,
      });
    }
  }, [category, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (category) {
        // Update existing category
        const updatedCategory = await updateCategory({
          ...category,
          name: values.name,
          description: values.description,
          is_active: values.is_active,
          updated_at: new Date().toISOString(),
        });
        onSave(updatedCategory);
      } else {
        // Create new category
        try {
          const categoryData = {
            name: values.name,
            description: values.description,
            is_active: values.is_active
          };
          
          const createdCategory = await createCategory(categoryData);
          onSave(createdCategory);
        } catch (error) {
          console.error("Error creating category:", error);
          toast({
            title: "Erro",
            description: error instanceof Error ? error.message : "Falha ao criar categoria",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar categoria. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição da categoria (opcional)" 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Categoria disponível para uso em produtos
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {category ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormModal;
