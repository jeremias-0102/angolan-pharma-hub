
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">PharmaPro</h1>
        <p className="text-gray-600">Sistema de Gestão Farmacêutica</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
