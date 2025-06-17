
import { STORES, add, getAll, get, update, remove } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export interface Shift {
  id: string;
  user_id: string;
  user_name: string;
  start_time: string;
  end_time?: string;
  status: 'active' | 'completed';
  notes?: string;
  total_sales?: number;
  created_at: string;
  updated_at: string;
}

// Iniciar turno
export const startShift = async (userId: string, userName: string): Promise<Shift> => {
  // Verificar se já existe um turno ativo para este usuário
  const activeShifts = await getActiveShifts();
  const existingShift = activeShifts.find(shift => shift.user_id === userId);
  
  if (existingShift) {
    throw new Error('Já existe um turno ativo para este usuário');
  }

  const newShift: Shift = {
    id: uuidv4(),
    user_id: userId,
    user_name: userName,
    start_time: new Date().toISOString(),
    status: 'active',
    total_sales: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  await add<Shift>(STORES.DELIVERIES, newShift); // Reutilizando store existente
  return newShift;
};

// Finalizar turno
export const endShift = async (shiftId: string, notes?: string): Promise<Shift | null> => {
  const shift = await get<Shift>(STORES.DELIVERIES, shiftId);
  
  if (!shift) {
    throw new Error('Turno não encontrado');
  }

  if (shift.status === 'completed') {
    throw new Error('Este turno já foi finalizado');
  }

  const updatedShift: Shift = {
    ...shift,
    end_time: new Date().toISOString(),
    status: 'completed',
    notes,
    updated_at: new Date().toISOString()
  };

  await update<Shift>(STORES.DELIVERIES, updatedShift);
  return updatedShift;
};

// Obter turnos ativos
export const getActiveShifts = async (): Promise<Shift[]> => {
  const allShifts = await getAll<Shift>(STORES.DELIVERIES);
  return allShifts.filter(shift => 
    shift.status === 'active' && shift.start_time && !shift.end_time
  );
};

// Obter todos os turnos
export const getAllShifts = async (): Promise<Shift[]> => {
  return await getAll<Shift>(STORES.DELIVERIES);
};

// Obter turnos por usuário
export const getShiftsByUser = async (userId: string): Promise<Shift[]> => {
  const allShifts = await getAllShifts();
  return allShifts.filter(shift => shift.user_id === userId);
};

// Atualizar vendas do turno
export const updateShiftSales = async (userId: string, saleAmount: number): Promise<void> => {
  const activeShifts = await getActiveShifts();
  const userShift = activeShifts.find(shift => shift.user_id === userId);
  
  if (userShift) {
    const updatedShift: Shift = {
      ...userShift,
      total_sales: (userShift.total_sales || 0) + saleAmount,
      updated_at: new Date().toISOString()
    };
    
    await update<Shift>(STORES.DELIVERIES, updatedShift);
  }
};
