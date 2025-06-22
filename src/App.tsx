
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import { PrivateRoute } from '@/components/PrivateRoute';

// Import pages
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';

// Client pages
import ClientProfile from '@/pages/client/Profile';
import ClientOrderHistory from '@/pages/client/OrderHistory';

// Pharmacist pages
import PharmacistDashboard from '@/pages/pharmacist/PharmacistDashboard';

// Delivery pages
import DeliveryPanel from '@/pages/delivery/DeliveryPanel';
import DeliveryDashboard from '@/pages/delivery/DeliveryDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Admin routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <PrivateRoute allowedRoles={['admin', 'supervisor']}>
                        <AdminDashboard />
                      </PrivateRoute>
                    } 
                  />

                  {/* Client routes */}
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute allowedRoles={['client']}>
                        <ClientProfile />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <PrivateRoute allowedRoles={['client']}>
                        <ClientOrderHistory />
                      </PrivateRoute>
                    } 
                  />

                  {/* Pharmacist routes */}
                  <Route 
                    path="/pharmacist/*" 
                    element={
                      <PrivateRoute allowedRoles={['pharmacist']}>
                        <PharmacistDashboard />
                      </PrivateRoute>
                    } 
                  />

                  {/* Delivery routes */}
                  <Route 
                    path="/delivery" 
                    element={
                      <PrivateRoute allowedRoles={['delivery']}>
                        <DeliveryPanel />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/delivery/dashboard" 
                    element={
                      <PrivateRoute allowedRoles={['delivery']}>
                        <DeliveryDashboard />
                      </PrivateRoute>
                    } 
                  />

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
