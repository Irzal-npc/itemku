
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Database, Users, Package, Bell, ShoppingCart } from 'lucide-react';

const AdminDatabase = () => {
  const [stats, setStats] = useState({
    items: 0,
    users: 0,
    notifications: 0,
    purchases: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      // Fetch items count
      const { count: itemsCount } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true });

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch notifications count
      const { count: notificationsCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });

      // Fetch purchases count
      const { count: purchasesCount } = await supabase
        .from('purchase_history')
        .select('*', { count: 'exact', head: true });

      setStats({
        items: itemsCount || 0,
        users: usersCount || 0,
        notifications: notificationsCount || 0,
        purchases: purchasesCount || 0
      });
    } catch (error) {
      console.error('Error fetching database stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tableInfo = [
    { name: 'items', description: 'Game items and products', count: stats.items, icon: Package },
    { name: 'profiles', description: 'User profiles and information', count: stats.users, icon: Users },
    { name: 'notifications', description: 'User notifications', count: stats.notifications, icon: Bell },
    { name: 'purchase_history', description: 'Purchase transactions', count: stats.purchases, icon: ShoppingCart },
  ];

  if (loading) {
    return <div className="flex justify-center py-8">Loading database information...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={24} />
            Database Overview
          </CardTitle>
          <CardDescription>
            Monitor your database status and table information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {tableInfo.map((table) => {
              const Icon = table.icon;
              return (
                <Card key={table.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{table.count}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {table.name.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>
                Overview of all tables in your database
              </CardDescription>
            </CardHeader>
            <CardContent>
          <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Table Name</TableHead>
                      <TableHead className="min-w-[150px] hidden sm:table-cell">Description</TableHead>
                      <TableHead className="min-w-[80px]">Records</TableHead>
                      <TableHead className="min-w-[70px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableInfo.map((table) => (
                      <TableRow key={table.name}>
                        <TableCell className="font-medium font-mono text-sm">
                          <div>
                            <div>{table.name}</div>
                            <div className="text-xs text-muted-foreground sm:hidden truncate">
                              {table.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{table.description}</TableCell>
                        <TableCell className="text-sm font-medium">{table.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="text-xs">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-medium text-green-800 dark:text-green-200">
                    Database Online
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    All systems operational and responsive
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDatabase;
