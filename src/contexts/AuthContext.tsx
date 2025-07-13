
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface SavedAccount {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, saveAccount?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  switchAccount: () => void;
  resetPassword: (email: string) => Promise<void>;
  savedAccounts: SavedAccount[];
  removeSavedAccount: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const createAdminUser = (): User => {
  const now = new Date().toISOString();
  return {
    id: 'admin',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'admin@itemku.com',
    email_confirmed_at: now,
    phone: '',
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: {},
    user_metadata: { full_name: 'Administrator' },
    identities: [],
    created_at: now,
    updated_at: now
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved accounts from localStorage
    const saved = localStorage.getItem('itemku_saved_accounts');
    if (saved) {
      try {
        setSavedAccounts(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved accounts:', error);
      }
    }

    // Check for admin session
    const adminSession = localStorage.getItem('itemku_admin_session');
    if (adminSession) {
      try {
        const adminData = JSON.parse(adminSession);
        setIsAdmin(true);
        setIsAuthenticated(true);
        setUser(createAdminUser());
      } catch (error) {
        console.error('Error loading admin session:', error);
        localStorage.removeItem('itemku_admin_session');
      }
    }

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        if (session && !isAdmin) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsAuthenticated(!!session);
        } else if (!session && !isAdmin) {
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Then check for existing session (only if not admin)
    if (!adminSession) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log('Initial session:', session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
      });
    }

    return () => subscription.unsubscribe();
  }, [isAdmin]);

  const saveAccount = (email: string, name?: string) => {
    const newAccount: SavedAccount = { email, name };
    const updatedAccounts = savedAccounts.filter(acc => acc.email !== email);
    updatedAccounts.unshift(newAccount);
    
    // Keep only the last 5 accounts
    const limitedAccounts = updatedAccounts.slice(0, 5);
    setSavedAccounts(limitedAccounts);
    localStorage.setItem('itemku_saved_accounts', JSON.stringify(limitedAccounts));
  };

  const removeSavedAccount = (email: string) => {
    const updatedAccounts = savedAccounts.filter(acc => acc.email !== email);
    setSavedAccounts(updatedAccounts);
    localStorage.setItem('itemku_saved_accounts', JSON.stringify(updatedAccounts));
  };

  const login = async (email: string, password: string, saveAccountFlag?: boolean) => {
    try {
      // Check for admin credentials with proper email format
      if (email === 'admin@itemku.com' && password === 'admin') {
        const adminData = {
          email: 'admin@itemku.com',
          name: 'Administrator',
          timestamp: Date.now()
        };
        
        localStorage.setItem('itemku_admin_session', JSON.stringify(adminData));
        setIsAdmin(true);
        setIsAuthenticated(true);
        setUser(createAdminUser());
        
        toast({
          title: "Admin Login Successful",
          description: "Welcome, Administrator!",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'The email or password you entered is incorrect. Please check again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Your email has not been verified. Please check your email for verification.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a few minutes.';
        }
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        // Save account if requested
        if (saveAccountFlag) {
          const userName = data.user.user_metadata?.full_name;
          saveAccount(email, userName);
        }
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        
        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please use another email or login.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must have at least 6 characters.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Invalid email format. Please check again.';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'New account registration is currently unavailable.';
        }
        
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        // Save account after successful registration
        saveAccount(email, name);
        
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Reset password error:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('Invalid email')) {
          errorMessage = 'Invalid email format. Please check again.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Email not found. Please check again or register a new account.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many password reset requests. Please wait a few minutes.';
        }
        
        toast({
          title: "Password Reset Failed",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isAdmin) {
        localStorage.removeItem('itemku_admin_session');
        setIsAdmin(false);
        setIsAuthenticated(false);
        setUser(null);
        toast({
          title: "Admin Logout Successful",
          description: "You have successfully logged out of admin mode.",
        });
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout Successful",
          description: "You have successfully logged out of your account.",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const switchAccount = () => {
    logout();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      switchAccount,
      resetPassword,
      savedAccounts,
      removeSavedAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};
