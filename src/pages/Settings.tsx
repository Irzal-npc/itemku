
import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Bell, Moon, Sun, Monitor, Shield, Palette } from "lucide-react";
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    shareData: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    try {
      // Simulate saving settings
      setTimeout(() => {
        toast({
          title: t('common.success'),
          description: t('success.settingsSaved'),
        });
      }, 1000);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('error.settingsSave'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900 font-poppins transition-colors duration-200">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
              ITEMKU
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{t('settings.title')}</p>
          </div>
          <Navigation />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-8 transition-colors duration-200 border border-gray-200 dark:border-gray-700">
            {/* Theme Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.appearance')}</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t('settings.lightMode')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.lightModeDesc')}</p>
                    </div>
                  </div>
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className={theme === 'light' ? 'bg-gradient-to-r from-purple-600 to-purple-800' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  >
                    {theme === 'light' ? t('settings.active') : t('settings.select')}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t('settings.darkMode')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.darkModeDesc')}</p>
                    </div>
                  </div>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className={theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-purple-800' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  >
                    {theme === 'dark' ? t('settings.active') : t('settings.select')}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t('settings.systemMode')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.systemModeDesc')}</p>
                    </div>
                  </div>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('system')}
                    className={theme === 'system' ? 'bg-gradient-to-r from-purple-600 to-purple-800' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  >
                    {theme === 'system' ? t('settings.active') : t('settings.select')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.notifications')}</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.emailNotifications')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.emailNotificationsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationChange('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.pushNotifications')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.pushNotificationsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationChange('push')}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.marketingEmails')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.marketingEmailsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={() => handleNotificationChange('marketing')}
                  />
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.privacy')}</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.publicProfile')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.publicProfileDesc')}</p>
                  </div>
                  <Switch
                    checked={privacy.publicProfile}
                    onCheckedChange={() => handlePrivacyChange('publicProfile')}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('settings.shareData')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.shareDataDesc')}</p>
                  </div>
                  <Switch
                    checked={privacy.shareData}
                    onCheckedChange={() => handlePrivacyChange('shareData')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              >
                {t('settings.saveSettings')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
