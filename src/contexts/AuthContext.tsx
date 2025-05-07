
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'pharmacist' | 'delivery' | 'client';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in local storage
    const savedUser = localStorage.getItem('pharma_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user');
        localStorage.removeItem('pharma_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock data for demo purposes
  const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { id: 2, name: 'Pharmacist User', email: 'pharmacist@example.com', password: 'pharm123', role: 'pharmacist' },
    { id: 3, name: 'Delivery User', email: 'delivery@example.com', password: 'deliv123', role: 'delivery' },
    { id: 4, name: 'Client User', email: 'client@example.com', password: 'client123', role: 'client' },
  ];

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('pharma_user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pharma_user');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
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
