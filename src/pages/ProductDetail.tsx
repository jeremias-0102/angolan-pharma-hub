import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Check, 
  ShieldCheck, 
  Truck,
  Clock, 
  Info, 
  ArrowLeft,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/models';
import { getProductById } from '@/services/productService';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      try {
        if (id) {
          setLoading(true);
          const productData = await getProductById(id);
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "Erro ao carregar produto",
          description: "Não foi possível carregar os detalhes do produto.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  // Helper function to get category name
  const getCategoryName = (category: string | Category) => {
    return typeof category === 'string' ? category : category.name;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao seu carrinho.`
      });
    }
  };
  
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Helper function to check stock availability
  const stockAvailability = (product: Product) => {
    if (!product.batches || product.batches.length === 0) return 0;
    return product.batches.reduce((total, batch) => total + batch.quantity, 0);
  };

  // Price formatter
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 hover:bg-gray-100" 
          onClick={() => navigate('/produtos')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para produtos
        </Button>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex space-x-4">
                <Skeleton className="h-12 w-20" />
                <Skeleton className="h-12 flex-grow" />
              </div>
            </div>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <AspectRatio ratio={1 / 1} className="bg-white">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="object-contain w-full h-full p-4"
                />
              </AspectRatio>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {getCategoryName(product.category)}
                  </Badge>
                  {product.requiresPrescription && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Requer Prescrição Médica
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500">Fabricante: {product.manufacturer}</p>
                <p className="text-gray-500">Código: {product.code}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-3xl font-bold text-pharma-primary">
                  {formatPrice(product.price_sale)}
                </h2>
                {product.price_compare && product.price_compare > product.price_sale && (
                  <div className="flex items-center mt-1">
                    <span className="text-gray-400 line-through mr-2">
                      {formatPrice(product.price_compare)}
                    </span>
                    <Badge className="bg-green-500">
                      {Math.round(((product.price_compare - product.price_sale) / product.price_compare) * 100)}% OFF
                    </Badge>
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center space-x-2">
                <div className={`flex items-center ${stockAvailability(product) > 10 ? 'text-green-600' : stockAvailability(product) > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                  {stockAvailability(product) > 0 ? (
                    <>
                      <Check className="h-5 w-5 mr-1" />
                      <span className="font-medium">
                        {stockAvailability(product) > 10
                          ? 'Em estoque'
                          : `Apenas ${stockAvailability(product)} ${stockAvailability(product) === 1 ? 'unidade' : 'unidades'} disponível`}
                      </span>
                    </>
                  ) : (
                    <>
                      <Info className="h-5 w-5 mr-1" />
                      <span className="font-medium">Sem estoque</span>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row sm:items-center space-x-2">
                <div className="flex items-center border rounded-md overflow-hidden w-32">
                  <button 
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-medium"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full text-center px-2 py-2 border-0 focus:ring-0"
                  />
                  <button 
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-medium"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={stockAvailability(product) <= quantity}
                  >
                    +
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button 
                    onClick={handleAddToCart} 
                    disabled={stockAvailability(product) === 0}
                    variant="outline"
                    className="hover-scale"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                  <Button 
                    onClick={handleBuyNow} 
                    disabled={stockAvailability(product) === 0}
                    className="bg-pharma-primary hover:bg-pharma-primary/90 hover-scale"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Comprar Agora
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <ShieldCheck className="h-4 w-4 mr-1 text-pharma-primary" />
                  <span>Garantia de qualidade</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Truck className="h-4 w-4 mr-1 text-pharma-primary" />
                  <span>Entrega rápida</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="h-4 w-4 mr-1 text-pharma-primary" />
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Produto não encontrado</h2>
            <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => navigate('/produtos')}>Ver outros produtos</Button>
          </div>
        )}

        {product && (
          <div className="mt-12">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="usage">Como Usar</TabsTrigger>
                <TabsTrigger value="info">Informações</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Detalhes do Produto</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {product.details || product.description || 'Sem detalhes disponíveis para este produto.'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Características</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Categoria: {getCategoryName(product.category)}</li>
                        <li>Fabricante: {product.manufacturer}</li>
                        {product.active_ingredient && (
                          <li>Princípio Ativo: {product.active_ingredient}</li>
                        )}
                        {product.form && <li>Forma: {product.form}</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Informações Adicionais</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>
                          Prescrição Médica:{' '}
                          {product.requiresPrescription
                            ? 'Necessária'
                            : 'Não necessária'}
                        </li>
                        <li>Código do Produto: {product.code}</li>
                        {product.dosage && <li>Dosagem: {product.dosage}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="usage" className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Como Usar</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {product.usage_instructions ||
                      'Siga as instruções do seu médico ou farmacêutico. Para mais informações, consulte a bula do produto ou fale com nosso farmacêutico através do chat.'}
                  </p>
                  {product.requiresPrescription && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Atenção
                          </h3>
                          <div className="text-sm text-yellow-700">
                            <p>
                              Este medicamento requer prescrição médica. Você deverá enviar uma receita válida durante o processo de checkout.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="info" className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Informações Gerais</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {product.general_info ||
                      'Para mais informações sobre este produto, consulte a bula ou entre em contato com nosso suporte.'}
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Importante
                        </h3>
                        <div className="text-sm text-blue-700">
                          <p>
                            Mantenha todos os medicamentos fora do alcance de crianças e animais. Armazene em local fresco e seco, conforme indicado na embalagem.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
