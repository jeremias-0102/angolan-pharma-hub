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
import NotFound from '@/pages/NotFound';

// Admin pages
import AdminOverview from '@/pages/admin/AdminOverview';
import Dashboard from '@/pages/admin/Dashboard';
import ProductsManagement from '@/pages/admin/ProductsManagement';
import CategoriesManagement from '@/pages/admin/CategoriesManagement';
import BatchesManagement from '@/pages/admin/BatchesManagement';
import UsersManagement from '@/pages/admin/UsersManagement';
import OrdersManagement from '@/pages/admin/OrdersManagement';
import SuppliersManagement from '@/pages/admin/SuppliersManagement';
import AcquisitionsManagement from '@/pages/admin/AcquisitionsManagement';
import ReportsPage from '@/pages/admin/ReportsPage';
import FinancialReportsPage from '@/pages/admin/FinancialReportsPage';
import CompanySettings from '@/pages/admin/CompanySettings';

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
      <CartProvider>
        <NotificationsProvider>
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

                {/* Admin routes */}
                <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminOverview /></PrivateRoute>} />
                <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><Dashboard /></PrivateRoute>} />
                <Route path="/admin/products" element={<PrivateRoute allowedRoles={['admin']}><ProductsManagement /></PrivateRoute>} />
                <Route path="/admin/categories" element={<PrivateRoute allowedRoles={['admin']}><CategoriesManagement /></PrivateRoute>} />
                <Route path="/admin/batches" element={<PrivateRoute allowedRoles={['admin']}><BatchesManagement /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><UsersManagement /></PrivateRoute>} />
                <Route path="/admin/orders" element={<PrivateRoute allowedRoles={['admin']}><OrdersManagement /></PrivateRoute>} />
                <Route path="/admin/suppliers" element={<PrivateRoute allowedRoles={['admin']}><SuppliersManagement /></PrivateRoute>} />
                <Route path="/admin/acquisitions" element={<PrivateRoute allowedRoles={['admin']}><AcquisitionsManagement /></PrivateRoute>} />
                <Route path="/admin/reports" element={<PrivateRoute allowedRoles={['admin']}><ReportsPage /></PrivateRoute>} />
                <Route path="/admin/financial-reports" element={<PrivateRoute allowedRoles={['admin']}><FinancialReportsPage /></PrivateRoute>} />
                <Route path="/admin/settings" element={<PrivateRoute allowedRoles={['admin']}><CompanySettings /></PrivateRoute>} />

                {/* Client routes */}
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
        </NotificationsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
