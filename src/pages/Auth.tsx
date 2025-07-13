import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, X, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const { theme } = useTheme();
  const { login, register, resetPassword, savedAccounts, removeSavedAccount } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveAccount, setSaveAccount] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordPassword, setForgotPasswordPassword] = useState('');
  const [showForgotPasswordField, setShowForgotPasswordField] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSavedAccountClick = (account: { email: string; name?: string }) => {
    setFormData({
      ...formData,
      email: account.email
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(formData.email, formData.password, saveAccount);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }
        if (!formData.name.trim()) {
          setError('Full name is required');
          return;
        }
        await register(formData.name, formData.email, formData.password);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResettingPassword(true);
    setError(null);

    try {
      await resetPassword(forgotPasswordEmail);
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
      setForgotPasswordPassword('');
      setShowForgotPasswordField(false);
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error.message || 'An error occurred while resetting password');
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background text-foreground font-poppins flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">ITEMKU</h1>
            <p className="text-muted-foreground">
              Reset Password
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground text-center">
              Forgot Password
            </h2>

            <p className="text-sm text-muted-foreground mb-4 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-card-foreground">Email</label>
                <Input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {showForgotPasswordField && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-card-foreground">New Password</label>
                  <div className="relative">
                    <Input
                      type={showForgotPasswordField ? "text" : "password"}
                      value={forgotPasswordPassword}
                      onChange={(e) => setForgotPasswordPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordField(!showForgotPasswordField)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showForgotPasswordField ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowForgotPassword(false)}
                className="text-primary hover:underline font-medium"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-poppins flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">ITEMKU</h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Welcome back! Please sign in to continue' : 'Create your account to get started'}
          </p>
        </div>

        {/* Saved Accounts Section */}
        {isLogin && savedAccounts.length > 0 && (
          <div className="bg-card border border-border rounded-lg shadow-lg p-4 mb-4">
            <h3 className="text-sm font-medium mb-3 text-card-foreground">Saved Accounts</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {savedAccounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                  <button
                    onClick={() => handleSavedAccountClick(account)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <User size={16} className="text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {account.name || account.email}
                      </p>
                      {account.name && (
                        <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => removeSavedAccount(account.email)}
                    className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-card-foreground text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2 text-card-foreground">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-card-foreground">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-card-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isLogin ? "Enter your password" : "Create a password (minimum 6 characters)"}
                  required
                  minLength={isLogin ? undefined : 6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2 text-card-foreground">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="saveAccount"
                    checked={saveAccount}
                    onChange={(e) => setSaveAccount(e.target.checked)}
                    className="mr-2" 
                  />
                  <label htmlFor="saveAccount" className="text-sm text-card-foreground">
                    Save account for quick login
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" required />
                <label className="text-sm text-card-foreground">
                  I agree to the Terms and Conditions and Privacy Policy
                </label>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Create account here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
