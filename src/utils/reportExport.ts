
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface Column {
  header: string;
  accessor: string;
}

// Função para mostrar toast sem usar hooks
const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
  // Criar um evento personalizado para notificar sobre o toast
  const event = new CustomEvent('show-toast', {
    detail: { title, description, variant }
  });
  window.dispatchEvent(event);
};

export const exportToPDF = (title: string, data: any[], columns: Column[]) => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(12);
    doc.text(`Gerado em ${new Date().toLocaleDateString('pt-AO')}`, 14, 30);
    
    // Table header
    let y = 40;
    const startX = 14;
    const cellPadding = 10;
    const fontSize = 10;
    const cellWidth = (doc.internal.pageSize.width - 28) / columns.length;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(startX, y - 5, doc.internal.pageSize.width - 28, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize);
    
    columns.forEach((column, index) => {
      doc.text(column.header, startX + (index * cellWidth) + 2, y);
    });
    
    y += cellPadding;
    
    // Table body
    doc.setFont('helvetica', 'normal');
    data.forEach((row, i) => {
      columns.forEach((column, j) => {
        const cellValue = row[column.accessor]?.toString() || '';
        // Truncate long text to fit in cell
        const truncatedValue = cellValue.length > 20 ? cellValue.substring(0, 17) + '...' : cellValue;
        doc.text(truncatedValue, startX + (j * cellWidth) + 2, y);
      });
      y += cellPadding;
      
      // Add new page if needed
      if (y >= doc.internal.pageSize.height - 20) {
        doc.addPage();
        y = 20;
      }
    });
    
    // Save the PDF - força o download
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    
    // Criar link de download alternativo se necessário
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Relatório exportado!', 'O relatório foi exportado em formato PDF com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    showToast('Erro ao exportar', 'Houve um problema ao gerar o arquivo PDF.', 'destructive');
    return false;
  }
};

export const exportToExcel = (title: string, data: any[], columns: Column[]) => {
  try {
    // Format data for Excel
    const formattedData = data.map(row => {
      const newRow: Record<string, any> = {};
      columns.forEach(column => {
        newRow[column.header] = row[column.accessor];
      });
      return newRow;
    });
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    
    // Generate Excel file - força o download
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    showToast('Relatório exportado!', 'O relatório foi exportado em formato Excel com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    showToast('Erro ao exportar', 'Houve um problema ao gerar o arquivo Excel.', 'destructive');
    return false;
  }
};

// Função para gerar fatura de cliente em PDF
export const generateClientInvoicePDF = (order: any) => {
  try {
    const doc = new jsPDF();
    
    // Header da fatura
    doc.setFontSize(20);
    doc.text('FATURA', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Fatura Nº: ${order.id}`, 14, 35);
    doc.text(`Data: ${new Date(order.created_at).toLocaleDateString('pt-AO')}`, 14, 45);
    
    // Dados do cliente
    doc.setFontSize(14);
    doc.text('DADOS DO CLIENTE:', 14, 65);
    doc.setFontSize(10);
    doc.text(`Nome: ${order.customer_name}`, 14, 75);
    doc.text(`Email: ${order.customer_email}`, 14, 85);
    doc.text(`Telefone: ${order.customer_phone}`, 14, 95);
    doc.text(`Endereço: ${order.shipping_address}`, 14, 105);
    
    // Tabela de itens
    let y = 125;
    doc.setFontSize(12);
    doc.text('ITENS DA FATURA:', 14, y);
    y += 15;
    
    // Cabeçalho da tabela
    doc.setFontSize(10);
    doc.text('Produto', 14, y);
    doc.text('Qtd', 100, y);
    doc.text('Preço Unit.', 130, y);
    doc.text('Total', 170, y);
    y += 10;
    
    // Linha separadora
    doc.line(14, y, 200, y);
    y += 10;
    
    // Itens
    order.items.forEach((item: any) => {
      doc.text(item.product_name.substring(0, 30), 14, y);
      doc.text(item.quantity.toString(), 100, y);
      doc.text(`${item.unit_price.toLocaleString()} Kz`, 130, y);
      doc.text(`${item.total.toLocaleString()} Kz`, 170, y);
      y += 10;
    });
    
    // Total
    y += 10;
    doc.line(14, y, 200, y);
    y += 15;
    doc.setFontSize(12);
    doc.text(`TOTAL: ${order.total.toLocaleString()} Kz`, 14, y);
    
    // Método de pagamento
    y += 20;
    doc.text(`Método de Pagamento: ${order.payment_method}`, 14, y);
    
    // Save
    const fileName = `fatura-${order.id}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    
    showToast('Fatura gerada!', 'A fatura foi gerada e baixada com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao gerar fatura:', error);
    showToast('Erro ao gerar fatura', 'Houve um problema ao gerar a fatura PDF.', 'destructive');
    return false;
  }
};

// Estas funções legadas são mantidas para compatibilidade
export const downloadPDF = exportToPDF;
export const downloadExcel = exportToExcel;
