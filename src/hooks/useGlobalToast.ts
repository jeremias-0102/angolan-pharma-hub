
import { useEffect } from 'react';
import { useToast } from './use-toast';

export const useGlobalToast = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { title, description, variant } = event.detail;
      toast({
        title,
        description,
        variant
      });
    };

    window.addEventListener('show-toast', handleShowToast as EventListener);
    
    return () => {
      window.removeEventListener('show-toast', handleShowToast as EventListener);
    };
  }, [toast]);
};
