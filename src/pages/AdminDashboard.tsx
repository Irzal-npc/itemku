
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Shield, Package, Megaphone, ArrowLeft } from 'lucide-react';
import AdminItems from '../components/admin/AdminItems';
import AdminPromotions from '../components/admin/AdminPromotions';

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('items');
  const [hasPromotions, setHasPromotions] = useState(false);

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
                <p className="text-muted-foreground">Manage items and promotions</p>
              </div>
            </div>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Admin Tabs - Only Items and Promotions */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${hasPromotions ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package size={16} />
              Items
            </TabsTrigger>
            {hasPromotions && (
              <TabsTrigger value="promotions" className="flex items-center gap-2">
                <Megaphone size={16} />
                Promotions
              </TabsTrigger>
            )}
          </TabsList>

          {/* Items Management Tab */}
          <TabsContent value="items">
            <AdminItems />
          </TabsContent>

          {/* Promotions Management Tab - Only show if there are promotions */}
          {hasPromotions && (
            <TabsContent value="promotions">
              <AdminPromotions onPromotionsChange={setHasPromotions} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
