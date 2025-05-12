
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export const exportToPDF = (
  title: string,
  data: any[],
  columns: { header: string; accessor: string }[],
  logoUrl?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Add title
  const fontSize = 18;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 51, 102);
  const titleWidth = doc.getTextWidth(title);
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(title, titleX, 20);
  
  // Add logo if provided
  if (logoUrl) {
    try {
      doc.addImage(logoUrl, 'PNG', 15, 10, 20, 20);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  }
  
  // Add date
  const currentDate = new Date().toLocaleDateString('pt-AO');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${currentDate}`, 15, 30);
  
  // Create table headers
  const headers = columns.map(col => col.header);
  
  // Extract table data
  const tableData = data.map(item => 
    columns.map(col => {
      const value = item[col.accessor];
      return value !== null && value !== undefined ? String(value) : '';
    })
  );
  
  // Define table styles
  const tableConfig = {
    head: [headers],
    body: tableData,
    startY: 40,
    styles: { 
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
  };
  
  // Generate table
  (doc as any).autoTable(tableConfig);
  
  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      'BEGJNP Pharma © 2025 - Todos os direitos reservados',
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - 15,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`);
};

export const exportToExcel = (
  title: string,
  data: any[],
  columns: { header: string; accessor: string }[]
) => {
  // Create worksheet with headers
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(item => {
      const newItem: any = {};
      columns.forEach(column => {
        newItem[column.header] = item[column.accessor];
      });
      return newItem;
    })
  );
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
  
  // Format column widths
  const maxLength: { [key: string]: number } = {};
  
  // Calculate column widths based on content
  columns.forEach((column, index) => {
    const header = column.header;
    maxLength[header] = header.length;
    
    data.forEach(item => {
      const cellValue = String(item[column.accessor] || '');
      maxLength[header] = Math.max(maxLength[header], cellValue.length);
    });
  });
  
  // Set column widths
  const colWidths = columns.map(column => ({ 
    wch: Math.min(50, maxLength[column.header] + 2) 
  }));
  worksheet['!cols'] = colWidths;
  
  // Generate current date string for filename
  const currentDate = new Date().toLocaleDateString('pt-AO').replace(/\//g, '-');
  
  // Write to file
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, '_')}_${currentDate}.xlsx`);
};
