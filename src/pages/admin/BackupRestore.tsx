
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Upload, Database, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const BackupRestore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleBack = () => {
    navigate('/admin');
  };

  const handleDownloadBackup = async () => {
    setIsDownloading(true);
    
    try {
      // Simular coleta de dados do sistema
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          products: 'Dados dos produtos...',
          suppliers: 'Dados dos fornecedores...',
          categories: 'Dados das categorias...',
          orders: 'Dados dos pedidos...',
          users: 'Dados dos usuários...',
          settings: 'Configurações do sistema...'
        }
      };

      // Criar arquivo JSON
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Criar link de download
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-begjnp-pharma-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup realizado com sucesso!",
        description: "A base de dados foi exportada e o download iniciou automaticamente.",
      });
    } catch (error) {
      toast({
        title: "Erro ao realizar backup",
        description: "Ocorreu um erro ao exportar a base de dados.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRestoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        // Validar estrutura do backup
        if (!backupData.data || !backupData.timestamp) {
          throw new Error('Arquivo de backup inválido');
        }

        // Aqui você restauraria os dados
        console.log('Restaurando backup:', backupData);

        toast({
          title: "Backup restaurado com sucesso!",
          description: "A base de dados foi restaurada. Recarregue a página para ver as alterações.",
        });
      } catch (error) {
        toast({
          title: "Erro ao restaurar backup",
          description: "O arquivo selecionado não é um backup válido.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Backup e Restauração</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fazer Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5 text-blue-600" />
              Fazer Backup
            </CardTitle>
            <CardDescription>
              Baixe uma cópia completa da base de dados atual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">O backup incluirá:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Todos os produtos cadastrados</li>
                <li>• Fornecedores e categorias</li>
                <li>• Histórico de pedidos</li>
                <li>• Dados dos usuários</li>
                <li>• Configurações do sistema</li>
              </ul>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-800">
                Última atualização: {new Date().toLocaleString('pt-AO')}
              </span>
            </div>

            <Button 
              onClick={handleDownloadBackup}
              disabled={isDownloading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isDownloading ? (
                "Gerando backup..."
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Backup
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Restaurar Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5 text-orange-600" />
              Restaurar Backup
            </CardTitle>
            <CardDescription>
              Restaure a base de dados a partir de um arquivo de backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Atenção!</p>
                <p>Esta ação substituirá todos os dados actuais. Certifique-se de ter um backup antes de continuar.</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Formatos aceitos:</h4>
              <Badge variant="outline" className="text-xs">
                .json (Backup BEGJNP Pharma)
              </Badge>
            </div>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreBackup}
                className="hidden"
                id="backup-upload"
                disabled={isUploading}
              />
              <Button 
                onClick={() => document.getElementById('backup-upload')?.click()}
                disabled={isUploading}
                variant="outline"
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                {isUploading ? (
                  "Restaurando..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Arquivo de Backup
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status do Sistema */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Online</div>
              <div className="text-sm text-green-700">Sistema Operacional</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1.2GB</div>
              <div className="text-sm text-blue-700">Tamanho da Base de Dados</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">15 min</div>
              <div className="text-sm text-purple-700">Último Backup Automático</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupRestore;
