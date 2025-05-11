
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Function to download report as PDF
export const downloadPDF = (elementId: string, title: string) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 20, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-AO')}`, 20, 30);
  
  // Get element to capture
  const element = document.getElementById(elementId);
  
  if (element) {
    // Capture the chart/report as an image (simplified version)
    // In a real implementation, we would use html2canvas to capture the chart as an image
    
    // For now, just adding some placeholder data tables
    const tableData = generatePlaceholderData(elementId);
    
    (doc as any).autoTable({
      head: [tableData.headers],
      body: tableData.data,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [136, 132, 216],
        textColor: [255, 255, 255]
      }
    });
    
    // Add BEGJNP Pharma footer
    doc.setFontSize(10);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text('© BEGJNP Pharma 2025', pageWidth / 2, 200, { align: 'center' });
    
    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`);
  }
};

// Function to download report data as Excel
export const downloadExcel = (data: any[], filename: string) => {
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
  
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().slice(0, 10)}.xlsx`);
};

// Helper function to generate placeholder data for PDF tables based on report type
const generatePlaceholderData = (elementId: string) => {
  switch (elementId) {
    case 'sales-report':
      return {
        headers: ['Mês', 'Vendas (AOA)', 'Lucro (AOA)', 'Crescimento (%)'],
        data: [
          ['Janeiro', '65,000', '15,000', '-'],
          ['Fevereiro', '78,000', '18,000', '20%'],
          ['Março', '98,000', '24,000', '25.6%'],
          ['Abril', '85,000', '21,000', '-13.3%'],
          ['Maio', '105,000', '28,000', '23.5%'],
          ['Junho', '92,000', '22,000', '-12.4%']
        ]
      };
    case 'inventory-report':
      return {
        headers: ['Mês', 'Nível de Estoque', 'Estoque Mínimo', 'Status'],
        data: [
          ['Janeiro', '120', '25', 'Adequado'],
          ['Fevereiro', '105', '25', 'Adequado'],
          ['Março', '140', '25', 'Adequado'],
          ['Abril', '90', '25', 'Adequado'],
          ['Maio', '75', '25', 'Adequado'],
          ['Junho', '110', '25', 'Adequado']
        ]
      };
    case 'purchases-report':
      return {
        headers: ['Mês', 'Valor de Compras (AOA)', 'Fornecedores', 'Itens'],
        data: [
          ['Janeiro', '42,000', '3', '12'],
          ['Fevereiro', '53,000', '4', '15'],
          ['Março', '61,000', '5', '18'],
          ['Abril', '45,000', '3', '14'],
          ['Maio', '70,000', '6', '22'],
          ['Junho', '52,000', '4', '16']
        ]
      };
    default:
      return {
        headers: ['Item', 'Valor'],
        data: [['Sem dados disponíveis', '-']]
      };
  }
};
