import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PurchaseHistoryProvider } from "./contexts/PurchaseHistoryContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import ItemDetail from "./pages/ItemDetail";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import PurchaseHistory from "./pages/PurchaseHistory";
import Auth from "./pages/Auth";
import SwitchAccount from "./pages/SwitchAccount";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  console.log("Authentication status:", isAuthenticated);

  if (!isAuthenticated) {
    console.log("User not authenticated, showing Auth page");
    return <Auth />;
  }

  console.log("User authenticated, showing main app");

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/item/:id" element={<ItemDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/switch-account" element={<SwitchAccount />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/purchase-history" element={<PurchaseHistory />} />
      <Route path="/admin" element={<AdminDashboard />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  console.log("App component rendered");
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system" storageKey="gamestore-theme">
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <CartProvider>
                  <NotificationProvider>
                    <PurchaseHistoryProvider>
                      <Toaster />
                      <Sonner />
                      <AppContent />
                    </PurchaseHistoryProvider>
                  </NotificationProvider>
                </CartProvider>
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
