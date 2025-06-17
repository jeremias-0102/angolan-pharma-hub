import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  register: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loginWithSocial: (userData: any) => Promise<void>;
  canAccessCart: () => boolean;
  canMakePurchases: () => boolean;
  canDeleteRecords: () => boolean;
  canAccessAdminPanel: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários demo atualizados com os novos privilégios
const DEMO_USERS = [
  {
    id: 'super-001',
    name: 'Supervisor Pharma',
    email: 'supervisor@pharma.com',
    password: 'super123',
    role: 'supervisor' as UserRole,
    phone: '+244 923 456 789',
    avatar: '',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'admin-001',
    name: 'Administrador Pharma',
    email: 'admin@pharma.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    phone: '+244 923 456 790',
    avatar: '',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pharm-001',
    name: 'Farmacêutico Demo',
    email: 'farmaceutico@pharma.com',
    password: 'farm123',
    role: 'pharmacist' as UserRole,
    phone: '+244 912 345 678',
    avatar: '',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'client-001',
    name: 'Cliente Demo',
    email: 'cliente@pharma.com',
    password: 'client123',
    role: 'client' as UserRole,
    phone: '+244 956 789 123',
    avatar: '',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Funções para verificar privilégios
  const canAccessCart = () => {
    if (!user) return true;
    // Admin e supervisor não podem acessar carrinho
    return !['admin', 'supervisor'].includes(user.role);
  };

  const canMakePurchases = () => {
    if (!user) return true;
    // Admin e supervisor não podem fazer compras
    return !['admin', 'supervisor'].includes(user.role);
  };

  const canDeleteRecords = () => {
    if (!user) return false;
    // Apenas supervisor pode deletar registros
    return user.role === 'supervisor';
  };

  const canAccessAdminPanel = () => {
    if (!user) return false;
    // Admin e supervisor podem acessar painel administrativo
    return ['admin', 'supervisor'].includes(user.role);
  };

  useEffect(() => {
    // Check for saved user in local storage
    const savedUserJson = localStorage.getItem('pharma_user');
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        setUser(savedUser);
        console.log('✅ Usuário carregado do localStorage:', savedUser.name, savedUser.role);
      } catch (error) {
        console.error('Failed to parse saved user');
        localStorage.removeItem('pharma_user');
      }
    }
    
    console.log('✅ CREDENCIAIS DISPONÍVEIS:');
    console.log('📧 SUPERVISOR: supervisor@pharma.com | 🔒 SENHA: super123');
    console.log('📧 ADMIN: admin@pharma.com | 🔒 SENHA: admin123');
    console.log('📧 FARMACÊUTICO: farmaceutico@pharma.com | 🔒 SENHA: farm123');
    console.log('📧 CLIENTE: cliente@pharma.com | 🔒 SENHA: client123');
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('🔄 Tentando fazer login com:', email);
      
      const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        console.log('✅ Usuário encontrado:', foundUser.name, foundUser.role);
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        localStorage.setItem('pharma_user', JSON.stringify(userWithoutPassword));
        
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo, ${foundUser.name}!`,
        });
      } else {
        console.log('❌ Email ou senha inválidos para:', email);
        toast({
          variant: "destructive",
          title: "Falha no login",
          description: "Email ou senha inválidos.",
        });
        throw new Error('Email ou senha inválidos');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (userData: any) => {
    setIsLoading(true);
    
    try {
      const { password: _, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword as User);
      localStorage.setItem('pharma_user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login social bem-sucedido",
        description: `Bem-vindo, ${userData.name}!`,
      });
      
      console.log('✅ Login social realizado:', userData.name, userData.provider);
    } catch (error) {
      console.error('❌ Erro no login social:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    
    try {
      // Check if email is already registered
      const existingUser = DEMO_USERS.find(u => u.email === userData.email);
      
      if (existingUser) {
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
      
      const { password: _, ...userWithoutPassword } = newUser;
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
    register,
    loginWithSocial,
    canAccessCart,
    canMakePurchases,
    canDeleteRecords,
    canAccessAdminPanel
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
