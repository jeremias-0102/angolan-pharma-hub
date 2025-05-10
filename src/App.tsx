
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";
import { initDB } from "@/lib/database";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// Role-specific dashboards
import AdminDashboard from "./pages/admin/Dashboard";
import PharmacistDashboard from "./pages/pharmacist/Dashboard";
import DeliveryDashboard from "./pages/delivery/Dashboard";
import ClientProfile from "./pages/client/Profile";

// Admin pages
import SuppliersManagement from "./pages/admin/SuppliersManagement";
import AcquisitionsManagement from "./pages/admin/AcquisitionsManagement";
import ReportsPage from "./pages/admin/ReportsPage";
import CompanySettings from "./pages/admin/CompanySettings";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize the database when the app starts
    initDB().catch(error => {
      console.error("Failed to initialize database:", error);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/produtos" element={<Products />} />
                <Route path="/produtos/:id" element={<ProductDetail />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                
                {/* Role-specific Dashboards */}
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/admin/fornecedores" element={<SuppliersManagement />} />
                <Route path="/admin/aquisicoes" element={<AcquisitionsManagement />} />
                <Route path="/admin/relatorios" element={<ReportsPage />} />
                <Route path="/admin/configuracao" element={<CompanySettings />} />
                <Route path="/pharmacist/*" element={<PharmacistDashboard />} />
                <Route path="/delivery/*" element={<DeliveryDashboard />} />
                <Route path="/profile" element={<ClientProfile />} />
                
                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
