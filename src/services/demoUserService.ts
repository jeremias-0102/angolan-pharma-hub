
import { User } from '@/types/models';
import { add, STORES, getAll } from '@/lib/database';

export const initializeDemoUsers = async (): Promise<void> => {
  try {
    // Check if users already exist
    const existingUsers = await getAll<User>(STORES.USERS);
    
    // Only create users if none exist
    if (existingUsers.length === 0) {
      const demoUsers: User[] = [
        {
          id: 'demo-admin-001',
          name: 'Administrador',
          email: 'admin@pharma.com',
          password: 'admin123',
          role: 'admin',
          phone: '+244 900 000 001',
          is_active: true,
          avatar: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-pharmacist-001',
          name: 'Farmacêutico Demo',
          email: 'farmaceutico@pharma.com',
          password: 'farm123',
          role: 'pharmacist',
          phone: '+244 900 000 002',
          is_active: true,
          avatar: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-delivery-001',
          name: 'Entregador Demo',
          email: 'entregador@pharma.com',
          password: 'deliv123',
          role: 'delivery',
          phone: '+244 900 000 003',
          is_active: true,
          avatar: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-client-001',
          name: 'Cliente Demo',
          email: 'cliente@pharma.com',
          password: 'client123',
          role: 'client',
          phone: '+244 900 000 004',
          is_active: true,
          avatar: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Save demo users to database
      for (const user of demoUsers) {
        await add(STORES.USERS, user);
      }

      console.log('Demo users initialized successfully');
      console.log('=== CREDENCIAIS DE ACESSO ===');
      console.log('ADMINISTRADOR:');
      console.log('  Email: admin@pharma.com');
      console.log('  Senha: admin123');
      console.log('');
      console.log('FARMACÊUTICO:');
      console.log('  Email: farmaceutico@pharma.com');
      console.log('  Senha: farm123');
      console.log('');
      console.log('ENTREGADOR:');
      console.log('  Email: entregador@pharma.com');
      console.log('  Senha: deliv123');
      console.log('');
      console.log('CLIENTE:');
      console.log('  Email: cliente@pharma.com');
      console.log('  Senha: client123');
    } else {
      console.log('Users already exist in database');
      const adminUser = existingUsers.find(u => u.role === 'admin');
      if (adminUser) {
        console.log('=== CREDENCIAIS DE ADMINISTRADOR ===');
        console.log('Email:', adminUser.email);
        console.log('Senha: admin123 (ou a senha original)');
      }
    }
  } catch (error) {
    console.error('Error initializing demo users:', error);
  }
};
