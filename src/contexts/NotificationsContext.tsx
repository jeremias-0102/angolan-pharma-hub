
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
  link?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Calcular contagem de notificações não lidas
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Efeito para carregar notificações do localStorage se disponível
  useEffect(() => {
    if (!user?.id) return;
    
    const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      }
    }
  }, [user?.id]);
  
  // Efeito para salvar notificações no localStorage quando atualizadas
  useEffect(() => {
    if (!user?.id) return;
    
    localStorage.setItem(
      `notifications_${user.id}`,
      JSON.stringify(notifications)
    );
  }, [notifications, user?.id]);
  
  // Adicionar nova notificação
  const addNotification = (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      ...notification,
      isRead: false,
      timestamp: new Date()
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    
    // Exibir toast para notificações em tempo real
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });
  };
  
  // Marcar uma notificação como lida
  const markAsRead = (id: string) => {
    setNotifications((prev) => 
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };
  
  // Marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };
  
  // Limpar todas as notificações
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications deve ser usado dentro de NotificationsProvider');
  }
  return context;
};
