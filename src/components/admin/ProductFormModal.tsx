import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/types/models';
import FileUpload from '@/components/ui/file-upload';
import { saveImage } from '@/services/productService';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  code: z.string().min(3, 'Código deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price_cost: z.coerce.number().positive('Preço de custo deve ser positivo'),
  price_sale: z.coerce.number().positive('Preço de venda deve ser positivo'),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
  supplier_id: z.string().min(1, 'Fornecedor é obrigatório'),
  manufacturer: z.string().min(3, 'Fabricante deve ter pelo menos 3 caracteres'),
  requiresPrescription: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductFormModal: React.FC<ProductFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  product 
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      code: product?.code || '',
      description: product?.description || '',
      price_cost: product?.price_cost || 0,
      price_sale: product?.price_sale || 0,
      category_id: product?.category_id || '',
      supplier_id: product?.supplier_id || '',
      manufacturer: product?.manufacturer || '',
      requiresPrescription: product?.requiresPrescription || false,
    }
  });

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    
    try {
      let imageUrl = product?.image || '';
      
      // Process image upload if a new file is selected
      if (imageFile) {
        imageUrl = await saveImage(imageFile);
      }
      
      const productData: Product = {
        id: product?.id || '',
        code: values.code,
        name: values.name,
        description: values.description,
        price_cost: values.price_cost,
        price_sale: values.price_sale,
        category_id: values.category_id,
        supplier_id: values.supplier_id,
        manufacturer: values.manufacturer,
        requiresPrescription: values.requiresPrescription,
        image: imageUrl,
        created_at: product?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        batches: product?.batches || [],
        stock: product?.stock || 0,
      };
      
      onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-y-auto py-4 pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código</FormLabel>
                        <FormControl>
                          <Input placeholder="MED-001" {...field} />
                        </FormControl>
                        <FormDescription>
                          Um código único para identificação do produto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Paracetamol 500mg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço de Custo</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min="0" step="0.01" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price_sale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço de Venda</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min="0" step="0.01" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Input placeholder="ID da Categoria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supplier_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor</FormLabel>
                        <FormControl>
                          <Input placeholder="ID do Fornecedor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fabricante</FormLabel>
                        <FormControl>
                          <Input placeholder="Pharma Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="requiresPrescription"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Requer prescrição médica</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <FormField
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel>Imagem do Produto</FormLabel>
                        <FileUpload
                          onFileChange={handleImageUpload}
                          initialPreview={product?.image}
                          accept="image/*"
                          maxSize={2}
                        />
                        <FormDescription>
                          Imagem ilustrativa do produto, JPG ou PNG até 2MB
                        </FormDescription>
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
                            placeholder="Descrição detalhada do produto..." 
                            {...field} 
                            className="min-h-[150px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-pharma-primary hover:bg-pharma-primary/90"
                >
                  {isLoading ? 'Salvando...' : product ? 'Salvar Alterações' : 'Adicionar Produto'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
