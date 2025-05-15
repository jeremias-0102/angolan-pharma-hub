
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NotificationBar from './NotificationBar';
import ChatWidget from '../chat/ChatWidget';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NotificationBar />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
