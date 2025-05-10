
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  initialPreview?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  initialPreview,
  accept = 'image/*',
  maxSize = 5, // Default 5MB
  className = '',
}) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (!file) {
      setError(null);
      setPreview(null);
      onFileChange(null);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`O tamanho do arquivo excede o limite de ${maxSize}MB`);
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setError(null);
    onFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative border rounded-md overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-40 object-contain bg-gray-50"
          />
          <Button 
            type="button"
            variant="outline" 
            size="icon" 
            className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 p-0"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={handleButtonClick}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            Clique para fazer upload
          </p>
          <p className="text-xs text-gray-400">
            {accept === 'image/*' ? 'JPG, PNG ou GIF' : accept.replace(/\./g, '').toUpperCase()}
            {maxSize && ` até ${maxSize}MB`}
          </p>
        </div>
      )}
      
      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
