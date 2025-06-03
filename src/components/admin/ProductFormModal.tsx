
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Product, Category, Supplier } from '@/types/models';
import { getAllCategories } from '@/services/categoryService';
import { getAllSuppliers } from '@/services/supplierService';
import { saveImage } from '@/services/productService';
import { Upload } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product
}) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price_cost: 0,
    price_sale: 0,
    category_id: '',
    supplier_id: '',
    manufacturer: '',
    requiresPrescription: false,
    image: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, suppliersData] = await Promise.all([
          getAllCategories(),
          getAllSuppliers()
        ]);
        setCategories(categoriesData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        description: product.description,
        price_cost: product.price_cost,
        price_sale: product.price_sale,
        category_id: typeof product.category === 'string' ? product.category : product.category_id || '',
        supplier_id: product.supplier_id || '',
        manufacturer: product.manufacturer,
        requiresPrescription: product.requiresPrescription,
        image: product.image || ''
      });
      setImagePreview(product.image || '');
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        price_cost: 0,
        price_sale: 0,
        category_id: '',
        supplier_id: '',
        manufacturer: '',
        requiresPrescription: false,
        image: ''
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = formData.image;
    
    if (imageFile) {
      try {
        imageUrl = await saveImage(imageFile);
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }

    const productData: Product = {
      id: product?.id || '',
      code: formData.code,
      name: formData.name,
      description: formData.description,
      price_cost: Number(formData.price_cost),
      price_sale: Number(formData.price_sale),
      category_id: formData.category_id,
      category: formData.category_id,
      supplier_id: formData.supplier_id,
      manufacturer: formData.manufacturer,
      requiresPrescription: formData.requiresPrescription,
      image: imageUrl,
      created_at: product?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      batches: product?.batches || [],
      stock: product?.stock || 0
    };

    onSave(productData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, requiresPrescription: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Código do Produto *</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                placeholder="Ex: MED-001"
              />
            </div>

            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ex: Paracetamol 500mg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descrição detalhada do produto..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_cost">Preço de Custo (AOA) *</Label>
              <Input
                id="price_cost"
                name="price_cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_cost}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="price_sale">Preço de Venda (AOA) *</Label>
              <Input
                id="price_sale"
                name="price_sale"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_sale}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category_id">Categoria *</Label>
              <Select value={formData.category_id} onValueChange={(value) => handleSelectChange('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="supplier_id">Fornecedor</Label>
              <Select value={formData.supplier_id} onValueChange={(value) => handleSelectChange('supplier_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="manufacturer">Fabricante *</Label>
            <Input
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              required
              placeholder="Ex: Pharma Inc."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="requiresPrescription"
              checked={formData.requiresPrescription}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="requiresPrescription">Requer receita médica</Label>
          </div>

          <div>
            <Label htmlFor="image">Imagem do Produto</Label>
            <div className="mt-2">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {imagePreview ? 'Alterar Imagem' : 'Fazer Upload da Imagem'}
              </Button>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-pharma-primary hover:bg-pharma-primary/90">
              {product ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
