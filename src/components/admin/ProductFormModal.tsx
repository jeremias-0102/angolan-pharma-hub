
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/models';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatchesManagement from './BatchesManagement';
import { Plus, X, Upload } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

// Categorias de medicamentos comuns em farmácias
const productCategories = [
  'analgésicos',
  'antibióticos',
  'anti-inflamatórios',
  'antipiréticos',
  'antialérgicos',
  'cardiológicos',
  'dermatológicos',
  'digestivos',
  'vitaminas',
  'oftalmológicos',
  'ortopédicos',
  'respiratórios',
  'outros',
];

// Form schema validation
const formSchema = z.object({
  code: z.string().min(3, { message: "O código deve ter pelo menos 3 caracteres" }),
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  price_cost: z.number().positive({ message: "O preço de custo deve ser positivo" }),
  price_sale: z.number().positive({ message: "O preço de venda deve ser positivo" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  manufacturer: z.string().min(2, { message: "O fabricante deve ter pelo menos 2 caracteres" }),
  requiresPrescription: z.boolean(),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: product?.code || '',
      name: product?.name || '',
      description: product?.description || '',
      price_cost: product?.price_cost || 0,
      price_sale: product?.price_sale || 0,
      category: product?.category || '',
      manufacturer: product?.manufacturer || '',
      requiresPrescription: product?.requiresPrescription || false,
      image: product?.image || '',
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        code: product?.code || '',
        name: product?.name || '',
        description: product?.description || '',
        price_cost: product?.price_cost || 0,
        price_sale: product?.price_sale || 0,
        category: product?.category || '',
        manufacturer: product?.manufacturer || '',
        requiresPrescription: product?.requiresPrescription || false,
        image: product?.image || '',
      });
      
      setImagePreview(product?.image || null);
      setImageFile(null);
    }
  }, [product, isOpen, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // In a real application, you'd upload the image to a server/cloud storage
      // and get back a URL to store in the database
      // For this demo, we'll pretend the preview URL is the stored URL
      form.setValue("image", URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    form.setValue("image", "");
  };

  const handleSubmit = (values: FormValues) => {
    // In a real application, you'd handle image upload here 
    // and wait for the URL before saving the product
    
    const productData: Product = {
      id: product?.id || '',
      code: values.code,
      name: values.name,
      description: values.description,
      price_cost: values.price_cost,
      price_sale: values.price_sale,
      category: values.category,
      manufacturer: values.manufacturer,
      requiresPrescription: values.requiresPrescription,
      image: values.image || '',
      created_at: product?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      batches: product?.batches || [],
    };
    
    onSave(productData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="details">Detalhes do Produto</TabsTrigger>
            <TabsTrigger value="batches" disabled={!product?.id}>
              Lotes e Estoque {!product?.id && "(Salve o produto primeiro)"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código do Produto</FormLabel>
                        <FormControl>
                          <Input placeholder="MED-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto</FormLabel>
                        <FormControl>
                          <Input placeholder="Paracetamol 500mg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price_cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Custo (AOA)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            min={0}
                            step="0.01"
                          />
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
                        <FormLabel>Preço de Venda (AOA)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            min={0}
                            step="0.01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productCategories.map((category) => (
                              <SelectItem key={category} value={category} className="capitalize">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <Input placeholder="Nome do fabricante" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="requiresPrescription"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Requer Prescrição Médica
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Marque se este medicamento exige receita médica para venda.
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
                
                <div className="space-y-3">
                  <FormLabel>Imagem do Produto</FormLabel>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 border rounded overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          type="button"
                          variant="destructive" 
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-500">
                          <Upload className="mx-auto h-8 w-8 mb-1" />
                          <span className="text-xs">Sem imagem</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('product-image')?.click()}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {imagePreview ? 'Trocar Imagem' : 'Adicionar Imagem'}
                      </Button>
                      <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Formatos suportados: JPG, PNG, GIF. Tamanho máximo: 5MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {product ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="batches">
            {product && (
              <BatchesManagement product={product} />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
