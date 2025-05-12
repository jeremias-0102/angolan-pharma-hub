
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useToast } from '@/components/ui/use-toast';

interface Column {
  header: string;
  accessor: string;
}

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
        doc.text(cellValue, startX + (j * cellWidth) + 2, y);
      });
      y += cellPadding;
      
      // Add new page if needed
      if (y >= doc.internal.pageSize.height - 20) {
        doc.addPage();
        y = 20;
      }
    });
    
    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    // Toast message
    const { toast } = useToast();
    toast({
      title: 'Relatório exportado!',
      description: 'O relatório foi exportado em formato PDF com sucesso.',
    });

    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    
    const { toast } = useToast();
    toast({
      title: 'Erro ao exportar',
      description: 'Houve um problema ao gerar o arquivo PDF.',
      variant: 'destructive',
    });
    
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
    
    // Generate Excel file
    XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    
    // Toast message
    const { toast } = useToast();
    toast({
      title: 'Relatório exportado!',
      description: 'O relatório foi exportado em formato Excel com sucesso.',
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    
    const { toast } = useToast();
    toast({
      title: 'Erro ao exportar',
      description: 'Houve um problema ao gerar o arquivo Excel.',
      variant: 'destructive',
    });
    
    return false;
  }
};

// Estas funções legadas são mantidas para compatibilidade
export const downloadPDF = exportToPDF;
export const downloadExcel = exportToExcel;
