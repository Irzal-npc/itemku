
import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { User, Key, LogOut } from "lucide-react";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateJoined: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Update profile data when fetched
  useEffect(() => {
    if (profile && user) {
      setProfileData({
        name: profile.full_name || '',
        email: user.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        dateJoined: profile.created_at || ''
      });
    } else if (user && !profile) {
      setProfileData({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: '',
        address: '',
        dateJoined: user.created_at || ''
      });
    }
  }, [profile, user]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { full_name: string; phone: string; address: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: data.full_name,
          phone: data.phone,
          address: data.address,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: t('common.success'),
        description: "Your profile information has been successfully saved!",
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      full_name: profileData.name,
      phone: profileData.phone,
      address: profileData.address
    });
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t('common.error'),
        description: "New passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      toast({
        title: t('common.error'), 
        description: "New password must be at least 6 characters long!",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: "Your password has been successfully updated!",
      });

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: t('common.error'),
        description: error.message || "Failed to update password!",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-poppins">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">ITEMKU</h1>
            <p className="text-muted-foreground">{t('profile.title')}</p>
          </div>
          <Navigation />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold text-card-foreground mb-2">{profileData.name || 'Loading...'}</h2>
                <p className="text-muted-foreground text-sm break-all">{profileData.email}</p>
              </div>
              
              <nav className="space-y-2 mb-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <User className="inline mr-2" size={16} />
                  {t('profile.information')}
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'password' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Key className="inline mr-2" size={16} />
                  {t('profile.resetPassword')}
                </button>
              </nav>

              <div className="border-t border-border pt-4">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2" size={16} />
                  {t('profile.logout')}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg shadow-lg p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('profile.information')}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">{t('profile.fullName')}</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">{t('profile.email')}</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        disabled
                        className="w-full p-3 border border-input rounded-lg bg-muted text-muted-foreground break-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">{t('profile.phone')}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">{t('profile.dateJoined')}</label>
                      <input
                        type="text"
                        value={profileData.dateJoined ? new Date(profileData.dateJoined).toLocaleDateString('en-US') : ''}
                        disabled
                        className="w-full p-3 border border-input rounded-lg bg-muted text-muted-foreground"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-card-foreground">{t('profile.address')}</label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSaveProfile} 
                    className="mt-6 bg-primary hover:bg-primary/90"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : t('profile.saveChanges')}
                  </Button>
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('profile.resetPassword')}</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">{t('profile.newPassword')}</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Enter new password (min 6 characters)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">{t('profile.confirmPassword')}</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button onClick={handleUpdatePassword} className="bg-primary hover:bg-primary/90">
                      {t('profile.updatePassword')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
