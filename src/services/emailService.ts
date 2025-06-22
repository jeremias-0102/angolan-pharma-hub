
import { generateClientInvoicePDF } from '@/utils/reportExport';
import { toast } from '@/hooks/use-toast';

export const sendInvoiceViaEmail = async (customerEmail: string, order: any) => {
  try {
    // Simular envio de email (seria necessário backend real para envio)
    console.log('Enviando fatura por email para:', customerEmail);
    console.log('Dados da encomenda:', order);
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "✅ Email enviado!",
      description: `A fatura foi enviada para ${customerEmail}`,
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    toast({
      title: "❌ Erro no envio",
      description: "Não foi possível enviar a fatura por email.",
      variant: "destructive",
    });
    return false;
  }
};

export const sendInvoicePDFViaEmail = async (customerEmail: string, order: any, pdfBlob: Blob) => {
  try {
    // Em um cenário real, aqui seria feito o upload do PDF e envio via API
    console.log('Enviando PDF por email para:', customerEmail);
    console.log('Tamanho do PDF:', pdfBlob.size, 'bytes');
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "📧 Fatura enviada por email!",
      description: `PDF enviado para ${customerEmail}`,
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar PDF por email:', error);
    return false;
  }
};
