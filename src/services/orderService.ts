
import { STORES, add, getAll, get, update, remove, getByIndex } from '@/lib/database';
import { Order, OrderStatus } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';
import { sendWhatsAppReceipt } from '@/utils/whatsappService';

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const orders = await getAll<Order>(STORES.ORDERS);
    return orders;
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const order = await get<Order>(STORES.ORDERS, id);
    return order;
  } catch (error) {
    console.error(`Error getting order with ID ${id}:`, error);
    throw error;
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const orders = await getByIndex<Order>(STORES.ORDERS, 'user_id', userId);
    return orders;
  } catch (error) {
    console.error(`Error getting orders for user ${userId}:`, error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> => {
  try {
    const now = new Date().toISOString();
    const newOrder: Order = {
      id: uuidv4(),
      ...order,
      created_at: now,
      updated_at: now
    };
    
    const result = await add<Order>(STORES.ORDERS, newOrder);
    
    // Adicionar notificações sobre novos pedidos (em uma aplicação real, isto deveria ser via websockets)
    try {
      // Simulação - em um ambiente de produção, isso seria via websockets ou push notifications
      console.log('New order created - Sending notifications:', newOrder.id);
    } catch (notifError) {
      console.error('Error sending notifications for new order:', notifError);
    }
    
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update an order
export const updateOrder = async (order: Order): Promise<Order> => {
  try {
    order.updated_at = new Date().toISOString();
    const result = await update<Order>(STORES.ORDERS, order);
    return result;
  } catch (error) {
    console.error(`Error updating order ${order.id}:`, error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await remove(STORES.ORDERS, id);
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  id: string, 
  status: OrderStatus
): Promise<Order> => {
  try {
    const order = await getOrderById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
    const previousStatus = order.status;
    order.status = status;
    order.updated_at = new Date().toISOString();
    
    // Se o pedido for marcado como "entregue" e tiver informações de entrega
    if (status === "delivered" && order.delivery) {
      order.delivery.status = "delivered";
      order.delivery.actual_delivery = new Date().toISOString();
    }
    
    // Se o pedido for marcado como "em transporte" e tiver informações de entrega
    if (status === "shipping" && order.delivery) {
      order.delivery.status = "in_progress";
      
      // Adicionar data estimada de entrega se não existir
      if (!order.delivery.estimated_delivery) {
        // Estimar entrega para 24 horas depois
        const estimatedDate = new Date();
        estimatedDate.setHours(estimatedDate.getHours() + 24);
        order.delivery.estimated_delivery = estimatedDate.toISOString();
      }
    }
    
    const updatedOrder = await update<Order>(STORES.ORDERS, order);
    
    // Enviar notificações quando houver alterações importantes no status
    try {
      // Se o pedido for aprovado (mudou de pendente para pago)
      if (previousStatus === "pending" && status === "paid") {
        console.log('Order approved - Sending notifications to customer:', updatedOrder.id);
        
        // Em uma implementação real, aqui enviaríamos notificações e emails
        
        // Preparar dados para WhatsApp (se disponível)
        const orderDetails = {
          id: order.id,
          items: order.items.map(item => ({
            product: {
              name: item.product_name,
              price: item.unit_price
            },
            quantity: item.quantity
          })),
          total: order.total,
          deliveryFee: order.delivery?.fee || 0,
          customerName: "Cliente", // Em um sistema real, viria dos dados do usuário
          customerPhone: order.customer_phone || "",
          date: new Date().toISOString(),
          paymentMethod: order.payment_method,
          address: order.delivery ? `${order.delivery.address}, ${order.delivery.district}, ${order.delivery.city}` : ""
        };
        
        // Tentar enviar recibo pelo WhatsApp (se tiver número)
        if (order.customer_phone) {
          console.log('Sending receipt via WhatsApp');
          try {
            sendWhatsAppReceipt(orderDetails);
          } catch (whatsappError) {
            console.error('Error sending WhatsApp receipt:', whatsappError);
          }
        }
      }
      
      // Se o pedido estiver pronto para entrega ou em rota de entrega
      if ((previousStatus === "processing" && status === "ready") || 
          (previousStatus === "ready" && status === "shipping")) {
        console.log('Order ready or shipping - Notifying delivery personnel:', updatedOrder.id);
        // Aqui enviaríamos notificações para a equipe de entrega
      }
      
      // Se o pedido foi entregue, notificar concluído
      if (status === "delivered" && previousStatus !== "delivered") {
        console.log('Order delivered - Notifying completion:', updatedOrder.id);
        // Aqui enviaríamos notificações de conclusão para admin e cliente
      }
    } catch (notifError) {
      console.error('Error sending status update notifications:', notifError);
    }
    
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error);
    throw error;
  }
};

// Assign order to delivery personnel
export const assignOrderToDelivery = async (
  orderId: string, 
  deliveryPersonId: string
): Promise<Order> => {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    // Criar ou atualizar informações de entrega
    if (!order.delivery) {
      order.delivery = {
        address: "", // Deve ser preenchido com endereço do cliente
        district: "",
        city: "",
        status: "assigned",
        assigned_to: deliveryPersonId
      };
    } else {
      order.delivery.status = "assigned";
      order.delivery.assigned_to = deliveryPersonId;
    }
    
    order.updated_at = new Date().toISOString();
    const updatedOrder = await update<Order>(STORES.ORDERS, order);
    
    // Notificar entregador sobre o novo pedido atribuído
    console.log(`Order ${orderId} assigned to delivery person ${deliveryPersonId}`);
    
    return updatedOrder;
  } catch (error) {
    console.error(`Error assigning order ${orderId} to delivery person:`, error);
    throw error;
  }
};

// Mark order as delivered
export const markOrderAsDelivered = async (
  orderId: string,
  deliveryNotes?: string
): Promise<Order> => {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    // Atualizar status do pedido e da entrega
    order.status = "delivered";
    
    if (order.delivery) {
      order.delivery.status = "delivered";
      order.delivery.actual_delivery = new Date().toISOString();
      if (deliveryNotes) {
        order.delivery.notes = deliveryNotes;
      }
    }
    
    order.updated_at = new Date().toISOString();
    const updatedOrder = await update<Order>(STORES.ORDERS, order);
    
    // Notificar cliente e administrador sobre a entrega concluída
    console.log(`Order ${orderId} marked as delivered`);
    
    return updatedOrder;
  } catch (error) {
    console.error(`Error marking order ${orderId} as delivered:`, error);
    throw error;
  }
};
