
import { STORES, add, getAll, get, update, queryWithFilters } from '@/lib/database';
import { Notification, StockAlert } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

// Get all notifications for a user
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const notifications = await queryWithFilters<Notification>(STORES.NOTIFICATIONS, { user_id: userId });
    return notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

// Create a new notification
export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>): Promise<Notification> => {
  try {
    const now = new Date().toISOString();
    const newNotification: Notification = {
      id: uuidv4(),
      ...notification,
      created_at: now,
      updated_at: now
    };
    
    const result = await add<Notification>(STORES.NOTIFICATIONS, newNotification);
    return result;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notification = await get<Notification>(STORES.NOTIFICATIONS, notificationId);
    if (notification) {
      notification.read = true;
      notification.updated_at = new Date().toISOString();
      await update<Notification>(STORES.NOTIFICATIONS, notification);
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    const notifications = await queryWithFilters<Notification>(STORES.NOTIFICATIONS, { 
      user_id: userId, 
      read: false 
    });
    return notifications.length;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    throw error;
  }
};

// Create stock alert notifications
export const createStockAlert = async (alert: Omit<StockAlert, 'id' | 'created_at'>): Promise<StockAlert> => {
  try {
    const now = new Date().toISOString();
    const newAlert: StockAlert = {
      id: uuidv4(),
      ...alert,
      created_at: now
    };
    
    const result = await add<StockAlert>(STORES.STOCK_ALERTS, newAlert);
    
    // Create notification for admins
    await createNotification({
      user_id: 'admin', // Would need to get actual admin users
      title: getAlertTitle(alert.alert_type),
      message: getAlertMessage(alert),
      type: alert.alert_type === 'expired' ? 'error' : 'warning',
      read: false
    });
    
    return result;
  } catch (error) {
    console.error('Error creating stock alert:', error);
    throw error;
  }
};

// Helper functions for alert messages
const getAlertTitle = (alertType: StockAlert['alert_type']): string => {
  switch (alertType) {
    case 'low_stock':
      return 'Estoque Baixo';
    case 'expired':
      return 'Produto Vencido';
    case 'near_expiry':
      return 'Produto Próximo ao Vencimento';
    default:
      return 'Alerta de Estoque';
  }
};

const getAlertMessage = (alert: Omit<StockAlert, 'id' | 'created_at'>): string => {
  switch (alert.alert_type) {
    case 'low_stock':
      return `${alert.product_name} está com estoque baixo (${alert.current_stock} unidades restantes)`;
    case 'expired':
      return `${alert.product_name} venceu em ${alert.expiry_date}`;
    case 'near_expiry':
      return `${alert.product_name} vence em ${alert.expiry_date}`;
    default:
      return `Alerta para ${alert.product_name}`;
  }
};

// Get all active stock alerts
export const getActiveStockAlerts = async (): Promise<StockAlert[]> => {
  try {
    return await queryWithFilters<StockAlert>(STORES.STOCK_ALERTS, { resolved: false });
  } catch (error) {
    console.error('Error getting active stock alerts:', error);
    throw error;
  }
};

// Resolve stock alert
export const resolveStockAlert = async (alertId: string): Promise<void> => {
  try {
    const alert = await get<StockAlert>(STORES.STOCK_ALERTS, alertId);
    if (alert) {
      alert.resolved = true;
      await update<StockAlert>(STORES.STOCK_ALERTS, alert);
    }
  } catch (error) {
    console.error('Error resolving stock alert:', error);
    throw error;
  }
};
