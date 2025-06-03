
import { User } from '@/types/models';
import { add, STORES } from '@/lib/database';

export const initializeDemoUsers = async (): Promise<void> => {
  try {
    const demoUsers: User[] = [
      {
        id: 'demo-admin-001',
        name: 'Admin Demo',
        email: 'admin@demo.com',
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
        email: 'farmaceutico@demo.com',
        password: 'farm123',
        role: 'pharmacist',
        phone: '+244 900 000 002',
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
  } catch (error) {
    console.error('Error initializing demo users:', error);
  }
};
