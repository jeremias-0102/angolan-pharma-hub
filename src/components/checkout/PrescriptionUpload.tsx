
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PrescriptionUploadProps {
  onFileUpload: (files: File[]) => void;
}

const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onFileUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate file types (only images)
      const invalidFiles = selectedFiles.filter(
        file => !file.type.match('image/*')
      );
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, envie apenas arquivos de imagem (JPEG, PNG, etc.).",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB each)
      const largeFiles = selectedFiles.filter(
        file => file.size > 5 * 1024 * 1024
      );
      
      if (largeFiles.length > 0) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido por arquivo é 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Generate previews
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      
      // Update state
      setFiles([...files, ...selectedFiles]);
      setPreviews([...previews, ...newPreviews]);
      
      // Notify parent component
      onFileUpload([...files, ...selectedFiles]);
      
      // Show success toast
      toast({
        title: "Arquivo(s) adicionado(s) com sucesso",
        description: `${selectedFiles.length} arquivo(s) adicionado(s) à sua prescrição.`
      });
    }
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    // Remove items at the specified index
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    // Update state
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    
    // Notify parent component
    onFileUpload(updatedFiles);
  };
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="prescription-upload"
        />
        <label 
          htmlFor="prescription-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium">
            Clique para enviar imagens da prescrição médica
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Formatos aceitos: JPEG, PNG, GIF. Tamanho máx: 5MB
          </p>
        </label>
      </div>
      
      {previews.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Imagens da Prescrição ({previews.length})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img 
                  src={preview} 
                  alt={`Prescrição ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {previews.length > 0 && (
        <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-start">
          <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
          <p className="text-sm text-green-800">
            Prescrição adicionada. Nossos farmacêuticos irão verificá-la antes de liberar os medicamentos.
          </p>
        </div>
      )}
    </div>
  );
};

// Importing the Check icon for the success message
import { Check } from 'lucide-react';

export default PrescriptionUpload;
