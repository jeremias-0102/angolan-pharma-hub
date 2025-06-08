
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BarChart3, Users, ShoppingCart, Package, DollarSign, Settings, ClipboardList, Building2, Tags, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center"
        >
          <Home className="mr-2 h-4 w-4" />
          Voltar ao Site
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Usuários</CardTitle>
            <CardDescription>Gerenciar usuários do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/usuarios">
                  <Users className="mr-2 h-4 w-4" />
                  Gerenciar Usuários
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Produtos</CardTitle>
            <CardDescription>Gerenciar produtos e categorias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/produtos">
                  <Package className="mr-2 h-4 w-4" />
                  Gerenciar Produtos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Categorias</CardTitle>
            <CardDescription>Gerenciar categorias de produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/categorias">
                  <Tags className="mr-2 h-4 w-4" />
                  Gerenciar Categorias
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Lotes</CardTitle>
            <CardDescription>Gerenciar lotes de produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/lotes">
                  <Package className="mr-2 h-4 w-4" />
                  Gerenciar Lotes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pedidos</CardTitle>
            <CardDescription>Visualizar e gerenciar pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/pedidos">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Gerenciar Pedidos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Relatórios</CardTitle>
            <CardDescription>Acesse os relatórios do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/relatorios">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Relatórios de Produtos e Estoque
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/relatorios-financeiros">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Relatórios Financeiros
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Fornecedores</CardTitle>
            <CardDescription>Gerenciar fornecedores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/fornecedores">
                  <Building2 className="mr-2 h-4 w-4" />
                  Gerenciar Fornecedores
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Aquisições</CardTitle>
            <CardDescription>Gerenciar aquisições de produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/aquisicoes">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Gerenciar Aquisições
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Configurações</CardTitle>
            <CardDescription>Configurações da empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/configuracoes">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações da Empresa
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
