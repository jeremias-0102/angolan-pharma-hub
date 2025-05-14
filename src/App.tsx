
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import Profile from './pages/client/Profile';
import AdminOverview from './pages/admin/AdminOverview';
import Dashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import UsersManagement from './pages/admin/UsersManagement';
import SuppliersManagement from './pages/admin/SuppliersManagement';
import AcquisitionsManagement from './pages/admin/AcquisitionsManagement';
import BatchesManagement from './pages/admin/BatchesManagement';
import CompanySettings from './pages/admin/CompanySettings';
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from "@/components/ui/toaster";
import { PrivateRoute } from './components/PrivateRoute';
import ReportsPage from './pages/admin/ReportsPage';
import ChatWidget from './components/chat/ChatWidget';
import FinancialReportsPage from './pages/admin/FinancialReportsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/produtos/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />

            {/* Rotas de cliente */}
            <Route path="/cliente/perfil" element={
              <PrivateRoute allowedRoles={['client']}>
                <Profile />
              </PrivateRoute>
            } />

            {/* Rotas de Admin */}
            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminOverview />
              </PrivateRoute>
            } />
            <Route path="/admin/dashboard" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/produtos" element={
              <PrivateRoute allowedRoles={['admin']}>
                <ProductsManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/pedidos" element={
              <PrivateRoute allowedRoles={['admin']}>
                <OrdersManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/usuarios" element={
              <PrivateRoute allowedRoles={['admin']}>
                <UsersManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/fornecedores" element={
              <PrivateRoute allowedRoles={['admin']}>
                <SuppliersManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/aquisicoes" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AcquisitionsManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/lotes" element={
              <PrivateRoute allowedRoles={['admin']}>
                <BatchesManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/configuracoes" element={
              <PrivateRoute allowedRoles={['admin']}>
                <CompanySettings />
              </PrivateRoute>
            } />
            <Route path="/admin/relatorios" element={
              <PrivateRoute allowedRoles={['admin']}>
                <ReportsPage />
              </PrivateRoute>
            } />
            <Route path="/admin/relatorios-financeiros" element={
              <PrivateRoute allowedRoles={['admin']}>
                <FinancialReportsPage />
              </PrivateRoute>
            } />

            {/* Rotas de Farmacêutico */}
            <Route path="/farmaceutico" element={
              <PrivateRoute allowedRoles={['pharmacist']}>
                <PharmacistDashboard />
              </PrivateRoute>
            } />

            {/* Rotas de Entregador */}
            <Route path="/entregador" element={
              <PrivateRoute allowedRoles={['delivery']}>
                <DeliveryDashboard />
              </PrivateRoute>
            } />
          </Routes>

          {/* Widget de chat disponível em todas as páginas */}
          <ChatWidget />
          
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
