
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { Toaster } from "./components/ui/toaster";

// Pages
import Index from './pages/Index';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductsManagement from './pages/admin/ProductsManagement';
import BatchesManagement from './pages/admin/BatchesManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import AcquisitionsManagement from './pages/admin/AcquisitionsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import ReportsPage from './pages/admin/ReportsPage';
import FinancialReportsPage from './pages/admin/FinancialReportsPage';
import CompanySettings from './pages/admin/CompanySettings';
import SuppliersManagement from './pages/admin/SuppliersManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';

// Client Pages
import ClientProfile from './pages/client/Profile';
import OrderHistory from './pages/client/OrderHistory';

// Pharmacist Pages
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import DeliveryOrdersPage from './pages/delivery/DeliveryOrdersPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/produtos" element={<MainLayout><Products /></MainLayout>} />
              <Route path="/produtos/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
              <Route path="/carrinho" element={<MainLayout><Cart /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
              <Route path="/sobre" element={<MainLayout><About /></MainLayout>} />
              <Route path="/contato" element={<MainLayout><Contact /></MainLayout>} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><Dashboard /></PrivateRoute>} />
              <Route path="/admin/produtos" element={<PrivateRoute allowedRoles={['admin']}><ProductsManagement /></PrivateRoute>} />
              <Route path="/admin/batches" element={<PrivateRoute allowedRoles={['admin']}><BatchesManagement /></PrivateRoute>} />
              <Route path="/admin/pedidos" element={<PrivateRoute allowedRoles={['admin']}><OrdersManagement /></PrivateRoute>} />
              <Route path="/admin/aquisicoes" element={<PrivateRoute allowedRoles={['admin']}><AcquisitionsManagement /></PrivateRoute>} />
              <Route path="/admin/usuarios" element={<PrivateRoute allowedRoles={['admin']}><UsersManagement /></PrivateRoute>} />
              <Route path="/admin/relatorios" element={<PrivateRoute allowedRoles={['admin']}><ReportsPage /></PrivateRoute>} />
              <Route path="/admin/financeiro" element={<PrivateRoute allowedRoles={['admin']}><FinancialReportsPage /></PrivateRoute>} />
              <Route path="/admin/configuracoes" element={<PrivateRoute allowedRoles={['admin']}><CompanySettings /></PrivateRoute>} />
              <Route path="/admin/fornecedores" element={<PrivateRoute allowedRoles={['admin']}><SuppliersManagement /></PrivateRoute>} />
              <Route path="/admin/categorias" element={<PrivateRoute allowedRoles={['admin']}><CategoriesManagement /></PrivateRoute>} />
              
              {/* Client Routes */}
              <Route path="/perfil" element={<PrivateRoute allowedRoles={['client']}><MainLayout><ClientProfile /></MainLayout></PrivateRoute>} />
              <Route path="/pedidos" element={<PrivateRoute allowedRoles={['client']}><MainLayout><OrderHistory /></MainLayout></PrivateRoute>} />
              
              {/* Pharmacist Routes */}
              <Route path="/farmaceutico" element={<PrivateRoute allowedRoles={['pharmacist']}><PharmacistDashboard /></PrivateRoute>} />
              
              {/* Delivery Routes */}
              <Route path="/entrega" element={<PrivateRoute allowedRoles={['delivery']}><DeliveryDashboard /></PrivateRoute>} />
              <Route path="/entrega/pedidos" element={<PrivateRoute allowedRoles={['delivery']}><DeliveryOrdersPage /></PrivateRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
