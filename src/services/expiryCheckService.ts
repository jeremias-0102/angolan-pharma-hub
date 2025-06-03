
import { getAllProducts } from './productService';
import { createNotification } from './notificationService';
import { getAll, STORES } from '@/lib/database';
import { User, Product, Batch } from '@/types/models';
import { differenceInDays, parseISO } from 'date-fns';

// Verificar produtos próximos ao vencimento (executar diariamente)
export const checkExpiringProducts = async (): Promise<void> => {
  try {
    // Buscar todos os produtos
    const products = await getAllProducts();
    
    // Buscar admins e farmacêuticos para notificar
    const users = await getAll<User>(STORES.USERS);
    const adminsAndPharmacists = users.filter(user => 
      user.role === 'admin' || user.role === 'pharmacist'
    );

    // Verificar cada produto e seus lotes
    for (const product of products) {
      if (product.batches && product.batches.length > 0) {
        for (const batch of product.batches) {
          const daysToExpiry = getDaysToExpiry(batch.expiry_date);
          
          // Notificar se o produto expira em 30 dias ou menos
          if (daysToExpiry <= 30 && daysToExpiry > 0) {
            for (const user of adminsAndPharmacists) {
              await createNotification({
                user_id: user.id,
                title: 'Produto próximo ao vencimento',
                message: `${product.name} (Lote: ${batch.batch_number}) vence em ${daysToExpiry} dias`,
                type: 'warning',
                read: false
              });
            }
          }
          
          // Notificar se o produto já expirou
          if (daysToExpiry <= 0) {
            for (const user of adminsAndPharmacists) {
              await createNotification({
                user_id: user.id,
                title: 'Produto expirado',
                message: `${product.name} (Lote: ${batch.batch_number}) expirou há ${Math.abs(daysToExpiry)} dias`,
                type: 'error',
                read: false
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao verificar produtos próximos ao vencimento:', error);
  }
};

// Calcular dias até a expiração
const getDaysToExpiry = (expiryDateStr: string): number => {
  try {
    const expiryDate = parseISO(expiryDateStr);
    const today = new Date();
    return differenceInDays(expiryDate, today);
  } catch (error) {
    console.error('Erro ao calcular dias para expiração:', error);
    return 0;
  }
};

// Simular verificação automática (em produção seria executada via cron job)
export const startExpiryMonitoring = (): void => {
  // Executar verificação a cada 24 horas (86400000 ms)
  setInterval(checkExpiringProducts, 86400000);
  
  // Executar uma verificação inicial após 10 segundos
  setTimeout(checkExpiringProducts, 10000);
};
