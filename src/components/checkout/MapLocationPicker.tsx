
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface MapLocationPickerProps {
  onLocationSelect: (location: [number, number]) => void;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Default coordinates for Luanda, Angola
    const defaultLocation: [number, number] = [-8.839988, 13.289437];
    
    // Initialize a map (this would use Google Maps or a similar service)
    // For now, creating a placeholder with styling
    if (mapRef.current) {
      // In a real implementation, we'd initialize the map here
      // and set up event handlers to capture selected coordinates
      
      // Simulating a location selection after a delay
      const timer = setTimeout(() => {
        onLocationSelect(defaultLocation);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [onLocationSelect]);
  
  return (
    <Card className="overflow-hidden">
      <div 
        ref={mapRef} 
        className="h-[200px] bg-gray-200 flex items-center justify-center relative"
      >
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{ backgroundImage: 'url(https://maps.googleapis.com/maps/api/staticmap?center=-8.839988,13.289437&zoom=13&size=600x300&maptype=roadmap&key=DEMO_KEY)' }}>
        </div>
        <div className="absolute">
          <div className="p-2 bg-white rounded-lg shadow-lg text-sm">
            Clique no mapa para selecionar sua localização
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MapLocationPicker;
