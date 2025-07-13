
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
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Shield className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage users, items, promotions and database</p>
              </div>
            </div>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Admin Tabs - Full Management */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database size={16} />
              Database
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Users
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package size={16} />
              Items
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Megaphone size={16} />
              Promotions
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
