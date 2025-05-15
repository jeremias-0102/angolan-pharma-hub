import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/models';
import { getAll, update, add, getByIndex, STORES } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  register: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

// Export the context so it can be imported in other files
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in local storage
    const savedUserJson = localStorage.getItem('pharma_user');
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        setUser(savedUser);
      } catch (error) {
        console.error('Failed to parse saved user');
        localStorage.removeItem('pharma_user');
      }
    }
    
    // Initialize the database with sample users if needed
    const initializeUsers = async () => {
      try {
        const existingUsers = await getAll<User>(STORES.USERS);
        
        if (existingUsers.length === 0) {
          // Add sample users if no users exist
          const sampleUsers = [
            {
              id: uuidv4(),
              name: 'Admin User',
              email: 'admin@example.com',
              password: 'admin123',
              role: 'admin' as UserRole,
              phone: '+244 923 456 789',
              avatar: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: uuidv4(),
              name: 'Pharmacist User',
              email: 'pharmacist@example.com',
              password: 'pharm123',
              role: 'pharmacist' as UserRole,
              phone: '+244 912 345 678',
              avatar: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: uuidv4(),
              name: 'Delivery User',
              email: 'delivery@example.com',
              password: 'deliv123',
              role: 'delivery' as UserRole,
              phone: '+244 934 567 890',
              avatar: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: uuidv4(),
              name: 'Client User',
              email: 'client@example.com',
              password: 'client123',
              role: 'client' as UserRole,
              phone: '+244 956 789 123',
              avatar: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          
          for (const user of sampleUsers) {
            await add(STORES.USERS, user);
          }
          
          console.log('Sample users created successfully');
        }
      } catch (error) {
        console.error('Error initializing users:', error);
      }
    };
    
    initializeUsers().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const users = await getAll<User>(STORES.USERS);
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        localStorage.setItem('pharma_user', JSON.stringify(userWithoutPassword));
        
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${foundUser.name}!`,
        });
      } else {
        throw new Error('Email ou senha inválidos');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: "Email ou senha inválidos.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    
    try {
      // Check if email is already registered
      const existingUsers = await getByIndex<User>(STORES.USERS, 'email', userData.email);
      
      if (existingUsers.length > 0) {
        toast({
          variant: "destructive",
          title: "Falha no registro",
          description: "Este email já está registrado.",
        });
        throw new Error('Email already exists');
      }
      
      const newUser: User = {
        ...userData,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await add(STORES.USERS, newUser);
      
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('pharma_user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso!",
      });
    } catch (error) {
      console.error('Registration error:', error);
      if ((error as Error).message !== 'Email already exists') {
        toast({
          variant: "destructive",
          title: "Falha no registro",
          description: "Ocorreu um erro ao criar sua conta.",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pharma_user');
    toast({
      title: "Logout realizado",
      description: "Sessão finalizada com sucesso.",
    });
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
