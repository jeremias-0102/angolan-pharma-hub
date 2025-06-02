
import { STORES, add, getAll, get, update, remove, queryWithFilters } from '@/lib/database';
import { FinancialTransaction, SalesReport, InventoryReport } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

// Get all financial transactions
export const getAllTransactions = async (): Promise<FinancialTransaction[]> => {
  try {
    const transactions = await getAll<FinancialTransaction>(STORES.FINANCIAL_TRANSACTIONS);
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting all transactions:', error);
    throw error;
  }
};

// Create a new transaction
export const addTransaction = async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<FinancialTransaction> => {
  try {
    const now = new Date().toISOString();
    const newTransaction: FinancialTransaction = {
      id: uuidv4(),
      ...transaction,
      created_at: now,
      updated_at: now
    };
    
    const result = await add<FinancialTransaction>(STORES.FINANCIAL_TRANSACTIONS, newTransaction);
    return result;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Get transactions by date range
export const getTransactionsByDateRange = async (startDate: string, endDate: string): Promise<FinancialTransaction[]> => {
  try {
    const allTransactions = await getAllTransactions();
    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  } catch (error) {
    console.error('Error getting transactions by date range:', error);
    throw error;
  }
};

// Get transactions by type
export const getTransactionsByType = async (type: 'income' | 'expense'): Promise<FinancialTransaction[]> => {
  try {
    return await queryWithFilters<FinancialTransaction>(STORES.FINANCIAL_TRANSACTIONS, { type });
  } catch (error) {
    console.error(`Error getting ${type} transactions:`, error);
    throw error;
  }
};

// Generate sales report
export const generateSalesReport = async (startDate: string, endDate: string): Promise<SalesReport> => {
  try {
    const transactions = await getTransactionsByDateRange(startDate, endDate);
    const salesTransactions = transactions.filter(t => t.type === 'income' && t.category === 'sales');
    
    const totalSales = salesTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalOrders = salesTransactions.length;
    
    // This would be more complex with real order data
    const report: SalesReport = {
      period: `${startDate} to ${endDate}`,
      total_sales: totalSales,
      total_orders: totalOrders,
      top_products: [], // Would need to aggregate from order items
      payment_methods: [] // Would need order payment method data
    };
    
    return report;
  } catch (error) {
    console.error('Error generating sales report:', error);
    throw error;
  }
};

// Calculate daily revenue
export const getDailyRevenue = async (): Promise<number> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = await getTransactionsByDateRange(today, today);
    const income = todayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return income;
  } catch (error) {
    console.error('Error calculating daily revenue:', error);
    throw error;
  }
};

// Calculate monthly revenue
export const getMonthlyRevenue = async (): Promise<number> => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const monthTransactions = await getTransactionsByDateRange(startOfMonth, endOfMonth);
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return income;
  } catch (error) {
    console.error('Error calculating monthly revenue:', error);
    throw error;
  }
};
