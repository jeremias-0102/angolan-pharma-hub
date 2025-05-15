
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NotificationBar from './NotificationBar';
import ChatWidget from '../chat/ChatWidget';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${fullWidth ? 'w-full' : 'container mx-auto px-4'} py-8`}>
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
