
import React, { createContext, useContext } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
}

const translations = {
  // Navigation
  'nav.home': 'Home',
  'nav.notifications': 'Notifications',
  'nav.history': 'Purchase History',
  'nav.profile': 'Profile',
  'nav.checkout': 'Checkout',
  'nav.cart': 'Cart',
  'nav.settings': 'Settings',
  'nav.welcome': 'Welcome back',
  
  // Settings
  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.notifications': 'Notifications',
  'settings.privacy': 'Privacy',
  'settings.lightMode': 'Light Mode',
  'settings.darkMode': 'Dark Mode',
  'settings.systemMode': 'System',
  'settings.lightModeDesc': 'Use light theme',
  'settings.darkModeDesc': 'Use dark theme',
  'settings.systemModeDesc': 'Follow system preference',
  'settings.emailNotifications': 'Email Notifications',
  'settings.emailNotificationsDesc': 'Receive email updates about your orders',
  'settings.pushNotifications': 'Push Notifications',
  'settings.pushNotificationsDesc': 'Get notified about new offers and updates',
  'settings.marketingEmails': 'Marketing Emails',
  'settings.marketingEmailsDesc': 'Receive promotional content and deals',
  'settings.publicProfile': 'Public Profile',
  'settings.publicProfileDesc': 'Make your profile visible to other users',
  'settings.shareData': 'Share Usage Data',
  'settings.shareDataDesc': 'Help improve our service by sharing anonymous data',
  'settings.saveSettings': 'Save Settings',
  'settings.active': 'Active',
  'settings.select': 'Select',
  
  // Item Detail
  'item.addToCart': 'Add to Cart',
  'item.buyNow': 'Buy Now',
  'item.description': 'Description',
  'item.specifications': 'Specifications',
  'item.reviews': 'Reviews',
  'item.relatedItems': 'Related Items',
  'item.outOfStock': 'Out of Stock',
  'item.inStock': 'In Stock',
  
  // Home Page
  'home.featuredItems': 'Featured Items',
  'home.newArrivals': 'New Arrivals',
  'home.bestSellers': 'Best Sellers',
  'home.categories': 'Categories',
  'home.search': 'Search products...',
  'home.filter': 'Filter',
  'home.sortBy': 'Sort By',
  'home.priceRange': 'Price Range',
  'home.category': 'Category',
  'home.brand': 'Brand',
  
  // Cart
  'cart.title': 'Shopping Cart',
  'cart.empty': 'Cart is empty',
  'cart.total': 'Total',
  'cart.checkout': 'Checkout',
  'cart.remove': 'Remove',
  'cart.quantity': 'Quantity',
  
  // Footer
  'footer.about': 'About Us',
  'footer.contact': 'Contact',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms & Conditions',
  'footer.help': 'Help',
  'footer.copyright': 'Copyright',
  
  // Common
  'common.loading': 'Loading...',
  'common.error': 'An error occurred',
  'common.success': 'Success',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.close': 'Close',
  
  // Profile
  'profile.title': 'My Profile',
  'profile.information': 'Profile Information',
  'profile.resetPassword': 'Reset Password',
  'profile.fullName': 'Full Name',
  'profile.email': 'Email',
  'profile.phone': 'Phone',
  'profile.address': 'Address',
  'profile.dateJoined': 'Date Joined',
  'profile.currentPassword': 'Current Password',
  'profile.newPassword': 'New Password',
  'profile.confirmPassword': 'Confirm New Password',
  'profile.saveChanges': 'Save Changes',
  'profile.updatePassword': 'Update Password',
  'profile.logout': 'Logout',
  
  // Success Messages
  'success.profileUpdated': 'Profile updated successfully!',
  'success.passwordUpdated': 'Password updated successfully!',
  'success.settingsSaved': 'Settings saved successfully!',
  
  // Error Messages
  'error.profileUpdate': 'Failed to update profile. Please try again.',
  'error.passwordUpdate': 'Failed to update password. Please try again.',
  'error.settingsSave': 'Failed to save settings. Please try again.',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = (key: string) => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
