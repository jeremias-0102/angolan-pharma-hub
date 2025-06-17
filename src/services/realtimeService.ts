
import { EventTarget } from 'event-target-shim';

// Singleton para eventos em tempo real
class RealtimeService extends EventTarget {
  private static instance: RealtimeService;

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  // Emitir evento quando dados são atualizados
  emit(eventType: string, data: any) {
    this.dispatchEvent(new CustomEvent(eventType, { detail: data }));
  }

  // Escutar mudanças
  on(eventType: string, callback: (event: CustomEvent) => void) {
    this.addEventListener(eventType, callback as EventListener);
  }

  // Parar de escutar
  off(eventType: string, callback: (event: CustomEvent) => void) {
    this.removeEventListener(eventType, callback as EventListener);
  }
}

export const realtimeService = RealtimeService.getInstance();

// Tipos de eventos
export const EVENTS = {
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  PRODUCT_CREATED: 'product_created',
  PRODUCT_UPDATED: 'product_updated',
  PRODUCT_DELETED: 'product_deleted',
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  SHIFT_STARTED: 'shift_started',
  SHIFT_ENDED: 'shift_ended',
  SALE_COMPLETED: 'sale_completed',
};

// Hook personalizado para usar o serviço de tempo real
export const useRealtime = (eventType: string, callback: (data: any) => void) => {
  React.useEffect(() => {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };

    realtimeService.on(eventType, handler);
    
    return () => {
      realtimeService.off(eventType, handler);
    };
  }, [eventType, callback]);
};
