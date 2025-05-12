
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhhcm1hY3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1920&q=80",
    title: "BEGJNPPharma",
    description: "Sistema de gestão farmacêutica integrado para atendimento, vendas, entregas e controle de estoque."
  },
  {
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Produtos de Qualidade",
    description: "Oferecemos uma ampla gama de produtos farmacêuticos com garantia de qualidade e procedência."
  },
  {
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Entrega Rápida",
    description: "Conte com nosso serviço de entrega expressa para receber seus medicamentos onde estiver."
  },
  {
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Profissionais Qualificados",
    description: "Nossa equipe de farmacêuticos está pronta para atendê-lo com excelência e dedicação."
  }
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayInterval = 5000; // 5 seconds for automatic transition

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Reset automatic slideshow
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, autoplayInterval);
    
    return () => {
      resetTimeout();
    };
  }, [currentSlide]); // Reset the timer when slide changes

  return (
    <div className="relative overflow-hidden h-[500px] md:h-[600px] lg:h-[700px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pharma-primary/70 to-pharma-accent/60 z-10"></div>
          <img 
            src={slide.image} 
            alt={slide.title}
            className="object-cover w-full h-full opacity-70"
          />
          <div className="container mx-auto px-4 h-full relative z-20">
            <div className="flex flex-col justify-center h-full max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed text-white animate-fade-in">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-30">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/20 border-white/30 hover:bg-white/30 rounded-full h-10 w-10"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/20 border-white/30 hover:bg-white/30 rounded-full h-10 w-10"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </Button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-5 left-0 right-0 z-30">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button 
              key={index} 
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
