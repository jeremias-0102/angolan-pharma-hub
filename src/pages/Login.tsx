
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Login() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };
  
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-6">
        <Link to="/" className="text-3xl font-bold">
          <span className="text-blue-600">BEGJNP</span>
          <span className="text-green-600">Pharma</span>
        </Link>
        <p className="text-gray-600">Sistema de Gestão Farmacêutica</p>
      </div>
      
      {showForgotPassword ? (
        <div className="w-full max-w-md">
          <ForgotPasswordForm onBack={handleBackToLogin} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onForgotPassword={handleForgotPassword} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      )}
      
      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
