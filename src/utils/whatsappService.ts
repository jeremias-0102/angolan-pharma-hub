
import { useToast } from "@/hooks/use-toast";

type OrderItem = {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
};

interface OrderDetails {
  id: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  customerName: string;
  customerPhone: string;
  date: string;
  paymentMethod: string;
  address?: string;
}

export const sendWhatsAppReceipt = async (order: OrderDetails): Promise<boolean> => {
  try {
    const { toast } = useToast();
    
    // Formatar número de telefone
    const phoneNumber = formatPhoneNumber(order.customerPhone);
    
    if (!phoneNumber) {
      console.error("Número de telefone inválido:", order.customerPhone);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o comprovante por WhatsApp. Número de telefone inválido.",
        variant: "destructive",
      });
      return false;
    }
    
    // Construir a mensagem do comprovante
    const message = buildReceiptMessage(order);
    
    // Criar URL para WhatsApp com a mensagem
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    // Para implementação completa, você usaria uma API WhatsApp Business aqui
    // Como demonstração, abrimos uma nova aba com a URL do WhatsApp Web
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "Comprovante enviado",
      description: "O comprovante da compra foi enviado para o WhatsApp do cliente.",
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar comprovante por WhatsApp:", error);
    return false;
  }
};

// Função para formatar o número de telefone para o formato internacional
const formatPhoneNumber = (phone: string): string => {
  // Remover todos os caracteres não numéricos
  const numericPhone = phone.replace(/\D/g, '');
  
  // Verificar se já tem o código do país
  if (numericPhone.startsWith('244')) {
    return numericPhone;
  }
  
  // Adicionar código de Angola se começar com 9
  if (numericPhone.startsWith('9') && numericPhone.length === 9) {
    return `244${numericPhone}`;
  }
  
  return numericPhone;
};

// Construir a mensagem do comprovante
const buildReceiptMessage = (order: OrderDetails): string => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  let message = `*COMPROVANTE DE COMPRA*\n\n`;
  message += `*Pedido:* #${order.id}\n`;
  message += `*Data:* ${order.date}\n`;
  message += `*Cliente:* ${order.customerName}\n\n`;
  message += `*ITENS*\n`;
  
  order.items.forEach(item => {
    message += `${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}\n`;
  });
  
  message += `\n*Subtotal:* ${formatPrice(order.total)}\n`;
  message += `*Taxa de entrega:* ${order.deliveryFee === 0 ? 'Grátis' : formatPrice(order.deliveryFee)}\n`;
  message += `*Total:* ${formatPrice(order.total + order.deliveryFee)}\n\n`;
  message += `*Forma de pagamento:* ${order.paymentMethod}\n`;
  
  if (order.address) {
    message += `\n*Endereço de entrega:*\n${order.address}\n\n`;
  }
  
  message += `Obrigado por comprar conosco!\n`;
  
  return message;
};
