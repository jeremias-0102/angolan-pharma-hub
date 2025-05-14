
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useAuth } from "@/contexts/AuthContext";

const NotificationBar: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fechar dropdown ao navegar
  useEffect(() => {
    return () => setIsDropdownOpen(false);
  }, [navigate]);

  // Manipular clique em notificação
  const handleNotificationClick = (notificationId: string, link?: string) => {
    markAsRead(notificationId);
    
    if (link) {
      navigate(link);
    }
    
    setIsDropdownOpen(false);
  };

  // Formatar timestamp relativo (ex: "há 5 minutos")
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return 'Agora';
    } else if (diffMin < 60) {
      return `Há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHour < 24) {
      return `Há ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
    } else if (diffDay < 7) {
      return `Há ${diffDay} ${diffDay === 1 ? 'dia' : 'dias'}`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  // Obter classe CSS com base no tipo de notificação
  const getNotificationTypeClass = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[0.6rem] font-medium text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <span className="sr-only">Notificações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
          <DropdownMenuLabel className="flex justify-between items-center">
            <span>Notificações</span>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="h-8 text-xs"
              >
                Marcar todas como lidas
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {notifications.length > 0 ? (
            <>
              {notifications.map(notification => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-pointer border-l-2 ${
                    !notification.isRead ? getNotificationTypeClass(notification.type) : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{notification.title}</span>
                    {!notification.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(notification.timestamp)}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {user?.role === 'admin' && (
                <DropdownMenuItem
                  className="flex justify-center text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    // Navegação para painel de notificações (se existir)
                  }}
                >
                  Ver todas as notificações
                </DropdownMenuItem>
              )}
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Check className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Não há notificações</p>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationBar;
