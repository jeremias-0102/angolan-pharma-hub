
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  fullWidth = false, 
  className 
}) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if we're on a dashboard page
  const isDashboardPage = location.pathname.includes('/admin') || 
                          location.pathname.includes('/pharmacist') || 
                          location.pathname.includes('/delivery') ||
                          location.pathname.includes('/profile');
  
  // Determine if the user is logged in and has a role that gets a special background
  const hasRoleBg = user?.role && ['admin', 'pharmacist', 'delivery'].includes(user.role);
  
  return (
    <div className={cn(
      "flex flex-col min-h-screen",
      isDashboardPage && hasRoleBg && `bg-sidebar/5`,
      className
    )}>
      <Navbar />
      <main className={cn(
        "flex-grow",
        fullWidth ? "" : "container mx-auto px-4 py-6 md:px-6"
      )}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
