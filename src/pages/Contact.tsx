import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, Clock, ArrowLeft } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Mensagem enviada",
      description: "Recebemos sua mensagem e responderemos em breve.",
    });
    
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  const handleBack = () => {
    navigate(-1);
  };
  
  // Cleanup function to prevent memory leaks and DOM issues
  const cleanupMap = () => {
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    
    // Clean up Google Maps instance
    if (googleMapRef.current) {
      googleMapRef.current = null;
    }
  };
  
  // Load the map after the component is mounted
  useEffect(() => {
    const loadMap = async () => {
      try {
        // Skip if the map is already loaded or map container doesn't exist
        if (mapLoaded || !mapRef.current) return;
        
        if (!window.google) {
          // Create a script element for Google Maps API
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&loading=async`;
          script.async = true;
          script.defer = true;
          script.onload = initializeMap;
          document.head.appendChild(script);
          scriptRef.current = script;
        } else {
          initializeMap();
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    const initializeMap = () => {
      try {
        // Ensure we have both the Google Maps API and the DOM element
        if (!mapRef.current || !window.google || !window.google.maps) return;
        
        // Create a new map instance
        const mapOptions = {
          center: { lat: -8.8383333, lng: 13.2344444 }, // Coordenadas de Luanda
          zoom: 15,
        };
        
        googleMapRef.current = new window.google.maps.Map(
          mapRef.current,
          mapOptions
        );
        
        // Add a marker for the pharmacy location
        if (window.google && window.google.maps && window.google.maps.Marker) {
          new window.google.maps.Marker({
            position: { lat: -8.8383333, lng: 13.2344444 },
            map: googleMapRef.current,
            title: "BEGJNPPharma"
          });
        }

        setMapLoaded(true);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    loadMap();
    
    // Clean up on component unmount
    return cleanupMap;
  }, [mapLoaded]);
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-pharma-primary to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Entre em Contato</h1>
          </div>
          <div className="max-w-3xl">
            <p className="text-lg opacity-90 mb-8">
              Estamos aqui para ajudar. Entre em contato com a BEGJNPPharma para tirar dúvidas ou enviar sugestões.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information and Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-5">
                <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
                
                <div className="space-y-6">
                  <Card className="p-4 border">
                    <div className="flex items-start">
                      <div className="p-2 bg-blue-100 rounded mr-4">
                        <MapPin className="h-6 w-6 text-pharma-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Endereço</h3>
                        <p className="text-gray-600 mt-1">
                          Avenida 4 de Fevereiro, 123<br />
                          Luanda, Angola
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border">
                    <div className="flex items-start">
                      <div className="p-2 bg-green-100 rounded mr-4">
                        <Phone className="h-6 w-6 text-pharma-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Telefone</h3>
                        <p className="text-gray-600 mt-1">
                          +244 923 456 789<br />
                          +244 912 345 678
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border">
                    <div className="flex items-start">
                      <div className="p-2 bg-purple-100 rounded mr-4">
                        <Mail className="h-6 w-6 text-pharma-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600 mt-1">
                          contato@begnjppharma.co.ao<br />
                          suporte@begnjppharma.co.ao
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border">
                    <div className="flex items-start">
                      <div className="p-2 bg-amber-100 rounded mr-4">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Horário de Atendimento</h3>
                        <p className="text-gray-600 mt-1">
                          Segunda a Sexta: 8h às 18h<br />
                          Sábados: 9h às 13h<br />
                          Domingos e Feriados: Fechado
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:col-span-7">
                <Card className="p-6 border">
                  <h2 className="text-2xl font-bold mb-6">Envie-nos uma Mensagem</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" placeholder="Seu nome" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" placeholder="+244 900 000 000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto</Label>
                        <Input id="subject" placeholder="Assunto da mensagem" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Escreva sua mensagem aqui..." 
                        rows={6}
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="bg-pharma-primary w-full sm:w-auto">
                      Enviar Mensagem
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Nossa Localização</h2>
              <p className="text-gray-600 mt-2">
                Venha nos visitar na sede da BEGJNPPharma em Luanda
              </p>
            </div>
            
            <div className="aspect-w-16 aspect-h-9">
              <div 
                ref={mapRef} 
                id="map" 
                className="w-full h-[400px] bg-gray-200 rounded-lg"
              >
                {!mapLoaded && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Carregando mapa...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
