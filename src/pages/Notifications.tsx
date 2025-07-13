
import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Button } from "../components/ui/button";
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useLanguage } from '../contexts/LanguageContext';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useLanguage();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900 font-poppins transition-colors duration-200">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">ITEMKU</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('nav.notifications')}</p>
          </div>
          <Navigation />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell size={24} />
              {t('nav.notifications')}
            </h2>
            {notifications.length > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                Mark All as Read
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-colors duration-200 ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                      : 'bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-purple-600 hover:text-purple-700"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
