
import React, { useState } from 'react';
import { ShoppingCart, Settings, User, Home, Bell, History, Shield } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import CartSidebar from './CartSidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { getTotalItems } = useCart();
  const { getUnreadCount } = useNotifications();
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm rounded-lg mx-2 md:mx-4 my-2">
        <div className="flex items-center justify-between w-full px-3 md:px-6 py-3 md:py-4">
          {/* Logo and Greeting Section */}
          <div className="flex items-center gap-2 md:gap-6 min-w-0">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <div className="relative flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=50&h=50&fit=crop&crop=center" 
                  alt="ITEMKU Logo" 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-md ring-2 ring-primary/20 dark:ring-purple-400/20"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              {user && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className="text-xs md:text-sm text-muted-foreground dark:text-gray-400 font-medium truncate">
                      <span className="hidden sm:inline">{t('nav.welcome')}, </span>
                      <span className="text-primary dark:text-purple-400 font-semibold truncate">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                      <span className="hidden sm:inline">!</span>
                    </p>
                    {isAdmin && (
                      <div className="flex items-center gap-1 px-1 md:px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded-full flex-shrink-0">
                        <Shield size={10} className="text-red-600 dark:text-red-400 md:w-3 md:h-3" />
                        <span className="text-xs font-medium text-red-600 dark:text-red-400 hidden sm:inline">ADMIN</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <button 
              className="p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 group"
              onClick={() => navigate('/')}
              title={t('nav.home')}
            >
              <Home size={18} className="md:w-5 md:h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-purple-400 transition-colors" />
            </button>

            <button 
              className="p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 relative group"
              onClick={() => navigate('/notifications')}
              title={t('nav.notifications')}
            >
              <Bell size={18} className="md:w-5 md:h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-purple-400 transition-colors" />
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {getUnreadCount()}
                </span>
              )}
            </button>

            <button 
              className="p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 group hidden sm:flex"
              onClick={() => navigate('/purchase-history')}
              title={t('nav.history')}
            >
              <History size={18} className="md:w-5 md:h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-purple-400 transition-colors" />
            </button>

            {isAdmin && (
              <button 
                className="p-2 md:p-3 hover:bg-red-100 dark:hover:bg-red-900/20 bg-red-50 dark:bg-red-900/10 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 group border border-red-200 dark:border-red-700"
                onClick={() => navigate('/admin')}
                title="Admin Dashboard"
              >
                <Shield size={18} className="md:w-5 md:h-5 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors" />
              </button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 group">
                  <User size={18} className="md:w-5 md:h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-purple-400 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  {t('nav.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/purchase-history')} className="hover:bg-gray-50 dark:hover:bg-gray-700 sm:hidden">
                  <History className="mr-2 h-4 w-4" />
                  {t('nav.history')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button 
              className="p-2 md:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 group hidden sm:flex"
              onClick={() => navigate('/settings')}
              title={t('nav.settings')}
            >
              <Settings size={18} className="md:w-5 md:h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-purple-400 transition-colors" />
            </button>
            
            <button 
              className="p-2 md:p-3 hover:bg-primary/10 dark:hover:bg-purple-900/20 bg-primary/5 dark:bg-purple-900/10 rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 relative group border border-primary/20 dark:border-purple-700"
              onClick={() => setIsCartOpen(true)}
              title={t('nav.cart')}
            >
              <ShoppingCart size={18} className="md:w-5 md:h-5 text-primary dark:text-purple-400 group-hover:text-primary/80 dark:group-hover:text-purple-300 transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary dark:bg-purple-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-medium shadow-lg">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navigation;
