
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { exportToPDF, exportToExcel } from '@/utils/reportExport';

interface ReportDownloadButtonsProps {
  title: string;
  data: any[];
  columns: { header: string; accessor: string }[];
}

const ReportDownloadButtons: React.FC<ReportDownloadButtonsProps> = ({ title, data, columns }) => {
  const handlePdfDownload = () => {
    exportToPDF(title, data, columns);
  };

  const handleExcelDownload = () => {
    exportToExcel(title, data, columns);
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-blue-600"
        onClick={handlePdfDownload}
      >
        <FileText className="mr-1 h-4 w-4" />
        Exportar PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center text-green-600"
        onClick={handleExcelDownload}
      >
        <Download className="mr-1 h-4 w-4" />
        Exportar Excel
      </Button>
    </div>
  );
};

export default ReportDownloadButtons;
