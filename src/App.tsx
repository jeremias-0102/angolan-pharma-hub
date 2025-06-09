
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { Toaster } from './components/ui/toaster';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import SuppliersManagement from './pages/admin/SuppliersManagement';
import UsersManagement from './pages/admin/UsersManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import ReportsPage from './pages/admin/ReportsPage';
import FinancialReportsPage from './pages/admin/FinancialReportsPage';
import CompanySettings from './pages/admin/CompanySettings';
import NotFound from './pages/NotFound';
import MyProfile from './pages/client/MyProfile';
import BackupRestore from './pages/admin/BackupRestore';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<Products />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                
                {/* Client routes */}
                <Route path="/meu-perfil" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<PrivateRoute allowedRoles={["admin"]}><Dashboard /></PrivateRoute>} />
                <Route path="/admin/produtos" element={<PrivateRoute allowedRoles={["admin"]}><ProductsManagement /></PrivateRoute>} />
                <Route path="/admin/categorias" element={<PrivateRoute allowedRoles={["admin"]}><CategoriesManagement /></PrivateRoute>} />
                <Route path="/admin/fornecedores" element={<PrivateRoute allowedRoles={["admin"]}><SuppliersManagement /></PrivateRoute>} />
                <Route path="/admin/usuarios" element={<PrivateRoute allowedRoles={["admin"]}><UsersManagement /></PrivateRoute>} />
                <Route path="/admin/pedidos" element={<PrivateRoute allowedRoles={["admin"]}><OrdersManagement /></PrivateRoute>} />
                <Route path="/admin/relatorios" element={<PrivateRoute allowedRoles={["admin"]}><ReportsPage /></PrivateRoute>} />
                <Route path="/admin/relatorios-financeiros" element={<PrivateRoute allowedRoles={["admin"]}><FinancialReportsPage /></PrivateRoute>} />
                <Route path="/admin/configuracoes" element={<PrivateRoute allowedRoles={["admin"]}><CompanySettings /></PrivateRoute>} />
                <Route path="/admin/backup" element={<PrivateRoute allowedRoles={["admin"]}><BackupRestore /></PrivateRoute>} />

                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
