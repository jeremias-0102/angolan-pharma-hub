
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import { PrivateRoute } from '@/components/PrivateRoute';

// Public pages
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import RecuperarSenha from '@/pages/RecuperarSenha';
import NotFound from '@/pages/NotFound';

// Admin pages
import Dashboard from '@/pages/admin/Dashboard';

// Client pages
import Profile from '@/pages/client/Profile';
import OrderHistory from '@/pages/client/OrderHistory';

// Pharmacist pages
import PharmacistDashboard from '@/pages/pharmacist/PharmacistDashboard';

// Delivery pages
import DeliveryDashboard from '@/pages/delivery/DeliveryDashboard';
import DeliveryOrdersPage from '@/pages/delivery/DeliveryOrdersPage';

// Chat Widget
import EnhancedChatWidget from '@/components/chat/EnhancedChatWidget';

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<Products />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/recuperar-senha" element={<RecuperarSenha />} />

                {/* Admin routes - supervisor e admin */}
                <Route path="/admin/*" element={<PrivateRoute allowedRoles={['admin', 'supervisor']}><Dashboard /></PrivateRoute>} />

                {/* Client routes - apenas clientes */}
                <Route path="/perfil" element={<PrivateRoute allowedRoles={['client']}><Profile /></PrivateRoute>} />
                <Route path="/pedidos" element={<PrivateRoute allowedRoles={['client']}><OrderHistory /></PrivateRoute>} />

                {/* Pharmacist routes */}
                <Route path="/farmaceutico" element={<PrivateRoute allowedRoles={['pharmacist']}><PharmacistDashboard /></PrivateRoute>} />

                {/* Delivery routes */}
                <Route path="/entregador" element={<PrivateRoute allowedRoles={['delivery_person']}><DeliveryDashboard /></PrivateRoute>} />
                <Route path="/entregador/pedidos" element={<PrivateRoute allowedRoles={['delivery_person']}><DeliveryOrdersPage /></PrivateRoute>} />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Global components */}
              <EnhancedChatWidget />
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
