import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, ShoppingBag, Package, FileText, Database, Settings } from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Gestão de Usuários',
      description: 'Gerenciar usuários do sistema',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      link: '/admin/users'
    },
    {
      title: 'Gestão de Produtos',
      description: 'Adicionar, editar e remover produtos',
      icon: <ShoppingBag className="h-8 w-8 text-green-600" />,
      link: '/admin/products'
    },
    {
      title: 'Gestão de Categorias',
      description: 'Adicionar, editar e remover categorias de produtos',
      icon: <Package className="h-8 w-8 text-orange-600" />,
      link: '/admin/categories'
    },
    {
      title: 'Relatórios',
      description: 'Visualizar e gerar relatórios do sistema',
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      link: '/admin/reports'
    },
    {
      title: 'Configurações',
      description: 'Configurações gerais do sistema',
      icon: <Settings className="h-8 w-8 text-gray-600" />,
      link: '/admin/settings'
    },
    {
      title: 'Backup & Restauração',
      description: 'Backup e restauração da base de dados',
      icon: <Database className="h-8 w-8 text-cyan-600" />,
      link: '/admin/backup'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(item.link)}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="mt-1">{item.description}</CardDescription>
              </div>
              {item.icon}
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Acessar <ArrowRight className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
