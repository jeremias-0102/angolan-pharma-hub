
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { exportToPDF, exportToExcel } from '@/utils/reportExport';
import { toast } from '@/hooks/use-toast';

interface ReportDownloadButtonsProps {
  title: string;
  data: any[];
  columns: { header: string; accessor: string }[];
}

const ReportDownloadButtons: React.FC<ReportDownloadButtonsProps> = ({ title, data, columns }) => {
  const handlePdfDownload = async () => {
    try {
      if (data.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há dados para exportar.",
          variant: "destructive",
        });
        return;
      }
      
      const success = exportToPDF(title, data, columns);
      if (success) {
        console.log('PDF gerado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar PDF. Tenta novamente.",
        variant: "destructive",
      });
    }
  };

  const handleExcelDownload = async () => {
    try {
      if (data.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há dados para exportar.",
          variant: "destructive",
        });
        return;
      }
      
      const success = exportToExcel(title, data, columns);
      if (success) {
        console.log('Excel gerado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar Excel. Tenta novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-blue-600 hover:bg-blue-50"
        onClick={handlePdfDownload}
      >
        <FileText className="mr-1 h-4 w-4" />
        Exportar PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-green-600 hover:bg-green-50"
        onClick={handleExcelDownload}
      >
        <Download className="mr-1 h-4 w-4" />
        Exportar Excel
      </Button>
    </div>
  );
};

export default ReportDownloadButtons;
