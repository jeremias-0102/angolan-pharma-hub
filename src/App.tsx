import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { Toaster } from './components/ui/toaster';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import Dashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import SuppliersManagement from './pages/admin/SuppliersManagement';
import UsersManagement from './pages/admin/UsersManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import ReportsPage from './pages/admin/ReportsPage';
import FinancialReportsPage from './pages/admin/FinancialReportsPage';
import CompanySettings from './pages/admin/CompanySettings';
import NotFoundPage from './pages/NotFoundPage';

// Import new pages
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/produtos" element={<ProductsPage />} />
                <Route path="/produto/:id" element={<ProductDetailsPage />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                <Route path="/confirmacao-pedido" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
                
                {/* Client routes */}
                <Route path="/meu-perfil" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<PrivateRoute requiredRole="admin"><Dashboard /></PrivateRoute>} />
                <Route path="/admin/produtos" element={<PrivateRoute requiredRole="admin"><ProductsManagement /></PrivateRoute>} />
                <Route path="/admin/categorias" element={<PrivateRoute requiredRole="admin"><CategoriesManagement /></PrivateRoute>} />
                <Route path="/admin/fornecedores" element={<PrivateRoute requiredRole="admin"><SuppliersManagement /></PrivateRoute>} />
                <Route path="/admin/usuarios" element={<PrivateRoute requiredRole="admin"><UsersManagement /></PrivateRoute>} />
                <Route path="/admin/pedidos" element={<PrivateRoute requiredRole="admin"><OrdersManagement /></PrivateRoute>} />
                <Route path="/admin/relatorios" element={<PrivateRoute requiredRole="admin"><ReportsPage /></PrivateRoute>} />
                <Route path="/admin/relatorios-financeiros" element={<PrivateRoute requiredRole="admin"><FinancialReportsPage /></PrivateRoute>} />
                <Route path="/admin/configuracoes" element={<PrivateRoute requiredRole="admin"><CompanySettings /></PrivateRoute>} />
                <Route path="/admin/backup" element={<PrivateRoute requiredRole="admin"><BackupRestore /></PrivateRoute>} />

                {/* Not Found */}
                <Route path="*" element={<NotFoundPage />} />
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
