
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Shield, Package, Megaphone, Users, Database, ArrowLeft } from 'lucide-react';
import AdminItems from '../components/admin/AdminItems';
import AdminPromotions from '../components/admin/AdminPromotions';
import AdminUsers from '../components/admin/AdminUsers';
import AdminDatabase from '../components/admin/AdminDatabase';

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('database');

  // Redirect if not admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-poppins">
      <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2 md:p-3 flex-shrink-0"
              size="sm"
            >
              <ArrowLeft size={18} className="md:w-5 md:h-5" />
            </Button>
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg flex-shrink-0">
                <Shield className="text-red-600 dark:text-red-400" size={20} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-3xl font-bold text-foreground truncate">Admin Dashboard</h1>
                <p className="text-muted-foreground text-sm md:text-base hidden sm:block">Manage users, items, promotions and database</p>
              </div>
            </div>
          </div>
          <Button onClick={logout} variant="outline" size="sm" className="w-full sm:w-auto">
            Logout
          </Button>
        </div>

        {/* Admin Tabs - Full Management */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="database" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
              <Database size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">Database</span>
              <span className="sm:hidden">DB</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
              <Users size={14} className="md:w-4 md:h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
              <Package size={14} className="md:w-4 md:h-4" />
              Items
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
              <Megaphone size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">Promotions</span>
              <span className="sm:hidden">Promo</span>
            </TabsTrigger>
          </TabsList>

          {/* Database Overview Tab */}
          <TabsContent value="database">
            <AdminDatabase />
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          {/* Items Management Tab */}
          <TabsContent value="items">
            <AdminItems />
          </TabsContent>

          {/* Promotions Management Tab */}
          <TabsContent value="promotions">
            <AdminPromotions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
