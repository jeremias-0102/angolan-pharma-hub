
import { getAllOrders } from './orderService';
import { getAllProducts } from './productService';
import { getAllTransactions } from './financialService';
import { getAllShifts } from './shiftsService';
import { exportToPDF, exportToExcel } from '@/utils/reportExport';

// Gerar relatório de vendas com dados reais
export const generateSalesReport = async (startDate?: string, endDate?: string) => {
  try {
    const orders = await getAllOrders();
    const transactions = await getAllTransactions();
    
    // Filtrar por data se fornecida
    let filteredOrders = orders;
    let filteredTransactions = transactions;
    
    if (startDate && endDate) {
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      });
      
      filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
      });
    }
    
    // Calcular totais usando 'total' em vez de 'total_amount'
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Preparar dados para exportação
    const reportData = filteredOrders.map(order => ({
      id: order.id,
      data: new Date(order.created_at).toLocaleDateString('pt-AO'),
      valor: `AOA ${order.total.toLocaleString()}`,
      status: order.status,
      cliente: order.customer_name || 'N/A'
    }));
    
    const columns = [
      { header: 'ID', accessor: 'id' },
      { header: 'Data', accessor: 'data' },
      { header: 'Valor', accessor: 'valor' },
      { header: 'Status', accessor: 'status' },
      { header: 'Cliente', accessor: 'cliente' }
    ];
    
    return {
      data: reportData,
      columns,
      summary: {
        totalSales,
        totalOrders,
        avgOrderValue
      }
    };
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    throw error;
  }
};

// Gerar relatório de estoque com dados reais
export const generateInventoryReport = async () => {
  try {
    const products = await getAllProducts();
    
    const reportData = products.map(product => ({
      codigo: product.code,
      nome: product.name,
      estoque: product.stock,
      preco_custo: `AOA ${product.price_cost.toLocaleString()}`,
      preco_venda: `AOA ${product.price_sale.toLocaleString()}`,
      categoria: product.category_id,
      status: product.stock <= 10 ? 'Estoque Baixo' : 'Normal'
    }));
    
    const columns = [
      { header: 'Código', accessor: 'codigo' },
      { header: 'Nome', accessor: 'nome' },
      { header: 'Estoque', accessor: 'estoque' },
      { header: 'Preço Custo', accessor: 'preco_custo' },
      { header: 'Preço Venda', accessor: 'preco_venda' },
      { header: 'Categoria', accessor: 'categoria' },
      { header: 'Status', accessor: 'status' }
    ];
    
    return {
      data: reportData,
      columns,
      summary: {
        totalProducts: products.length,
        lowStockProducts: products.filter(p => p.stock <= 10).length,
        totalInventoryValue: products.reduce((sum, p) => sum + (p.price_cost * p.stock), 0)
      }
    };
  } catch (error) {
    console.error('Erro ao gerar relatório de estoque:', error);
    throw error;
  }
};

// Gerar relatório de turnos com dados reais
export const generateShiftsReport = async (startDate?: string, endDate?: string) => {
  try {
    const shifts = await getAllShifts();
    
    // Filtrar por data se fornecida
    let filteredShifts = shifts;
    
    if (startDate && endDate) {
      filteredShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.start_time);
        return shiftDate >= new Date(startDate) && shiftDate <= new Date(endDate);
      });
    }
    
    const reportData = filteredShifts.map(shift => ({
      funcionario: shift.user_name,
      inicio: new Date(shift.start_time).toLocaleString('pt-AO'),
      fim: shift.end_time ? new Date(shift.end_time).toLocaleString('pt-AO') : 'Em andamento',
      duracao: shift.end_time ? 
        Math.round((new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime()) / (1000 * 60 * 60)) + 'h' : 
        'Em andamento',
      vendas: `AOA ${(shift.total_sales || 0).toLocaleString()}`,
      status: shift.status === 'active' ? 'Ativo' : 'Concluído'
    }));
    
    const columns = [
      { header: 'Funcionário', accessor: 'funcionario' },
      { header: 'Início', accessor: 'inicio' },
      { header: 'Fim', accessor: 'fim' },
      { header: 'Duração', accessor: 'duracao' },
      { header: 'Vendas', accessor: 'vendas' },
      { header: 'Status', accessor: 'status' }
    ];
    
    return {
      data: reportData,
      columns,
      summary: {
        totalShifts: filteredShifts.length,
        activeShifts: filteredShifts.filter(s => s.status === 'active').length,
        totalSales: filteredShifts.reduce((sum, s) => sum + (s.total_sales || 0), 0)
      }
    };
  } catch (error) {
    console.error('Erro ao gerar relatório de turnos:', error);
    throw error;
  }
};

// Exportar relatório para PDF
export const exportReportToPDF = async (reportType: 'sales' | 'inventory' | 'shifts', startDate?: string, endDate?: string) => {
  try {
    let report;
    let title;
    
    switch (reportType) {
      case 'sales':
        report = await generateSalesReport(startDate, endDate);
        title = 'Relatório de Vendas';
        break;
      case 'inventory':
        report = await generateInventoryReport();
        title = 'Relatório de Estoque';
        break;
      case 'shifts':
        report = await generateShiftsReport(startDate, endDate);
        title = 'Relatório de Turnos';
        break;
      default:
        throw new Error('Tipo de relatório inválido');
    }
    
    return exportToPDF(title, report.data, report.columns);
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    throw error;
  }
};

// Exportar relatório para Excel
export const exportReportToExcel = async (reportType: 'sales' | 'inventory' | 'shifts', startDate?: string, endDate?: string) => {
  try {
    let report;
    let title;
    
    switch (reportType) {
      case 'sales':
        report = await generateSalesReport(startDate, endDate);
        title = 'Relatório de Vendas';
        break;
      case 'inventory':
        report = await generateInventoryReport();
        title = 'Relatório de Estoque';
        break;
      case 'shifts':
        report = await generateShiftsReport(startDate, endDate);
        title = 'Relatório de Turnos';
        break;
      default:
        throw new Error('Tipo de relatório inválido');
    }
    
    return exportToExcel(title, report.data, report.columns);
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    throw error;
  }
};
