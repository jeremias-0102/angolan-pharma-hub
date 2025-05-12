
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MapLocationPickerProps {
  onLocationSelect: (location: [number, number]) => void;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([-8.839988, 13.289437]); // Default to Luanda
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Default coordinates for Luanda, Angola
    const defaultLocation: [number, number] = [-8.839988, 13.289437];
    
    // Initialize a map (this would use Google Maps or a similar service)
    // For now, creating a placeholder with styling
    if (mapRef.current) {
      // In a real implementation, we'd initialize the map here
      // and set up event handlers to capture selected coordinates
      
      // Simulating a map initialization
      setTimeout(() => {
        setIsLoading(false);
        setSelectedLocation(defaultLocation);
      }, 1000);
    }
  }, []);
  
  const handleMapClick = (x: number, y: number) => {
    // This is a simplified implementation - in a real app, this would get actual map coordinates
    // For now, we'll use random coordinates near Luanda
    const randomLat = -8.839988 + (Math.random() - 0.5) * 0.05;
    const randomLng = 13.289437 + (Math.random() - 0.5) * 0.05;
    
    const newLocation: [number, number] = [randomLat, randomLng];
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
    
    toast({
      title: "Localização selecionada",
      description: `Latitude: ${newLocation[0].toFixed(6)}, Longitude: ${newLocation[1].toFixed(6)}`,
    });
  };
  
  const confirmLocation = () => {
    onLocationSelect(selectedLocation);
    
    toast({
      title: "Localização confirmada",
      description: "Seu endereço foi salvo para entrega."
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-1 border-b">
        <h3 className="text-sm font-medium px-2">Selecione sua localização no mapa</h3>
      </div>
      <div 
        ref={mapRef} 
        className="h-[250px] bg-gray-100 flex items-center justify-center relative cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          handleMapClick(x, y);
        }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-sm text-gray-500">Carregando mapa...</p>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: 'url(https://maps.googleapis.com/maps/api/staticmap?center=-8.839988,13.289437&zoom=14&size=800x400&maptype=roadmap&key=DEMO_KEY)' }}>
            </div>
            <div className="absolute" style={{ 
              left: '50%', 
              top: '50%', 
              transform: 'translate(-50%, -100%)',
              animation: 'bounce 1s infinite alternate',
            }}>
              <MapPin className="h-8 w-8 text-blue-500 drop-shadow-md" />
            </div>
            <div className="absolute bottom-3 right-3">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  confirmLocation();
                }}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Confirmar localização
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="p-3 bg-gray-50 border-t">
        <p className="text-sm text-gray-500">
          Latitude: {selectedLocation[0].toFixed(6)}, Longitude: {selectedLocation[1].toFixed(6)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Clique no mapa para selecionar outro local ou use o botão para confirmar.
        </p>
      </div>
    </Card>
  );
};

export default MapLocationPicker;
