import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, UserX, Edit, ExternalLink, Shield, Plus, Eye, Trash2, RefreshCw, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

interface UserPurchase {
  id: string;
  total: number;
  order_date: string;
  status: string;
  payment_method: string;
  items: any;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [userPurchases, setUserPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      full_name: '',
      phone: '',
      address: ''
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      } else {
        console.log('Fetched users:', data);
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPurchases = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchase_history')
        .select('*')
        .eq('user_id', userId)
        .order('order_date', { ascending: false });

      if (error) {
        console.error('Error fetching user purchases:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user purchases",
          variant: "destructive",
        });
      } else {
        setUserPurchases(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewUser = async (user: Profile) => {
    setSelectedUser(user);
    await fetchUserPurchases(user.id);
    setShowUserDetail(true);
  };

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    form.reset({
      full_name: user.full_name || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = async (values: any) => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          phone: values.phone,
          address: values.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Error",
          description: "Failed to update user",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        setShowEditDialog(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openSupabaseUsers = () => {
    window.open('https://supabase.com/dashboard/project/dnlivtdghddphwkzsotg/auth/users', '_blank');
    toast({
      title: "Supabase Users",
      description: "Opening Supabase user management in new tab",
    });
  };

  const openSupabasePolicies = () => {
    window.open('https://supabase.com/dashboard/project/dnlivtdghddphwkzsotg/auth/policies', '_blank');
    toast({
      title: "Supabase Policies",
      description: "Opening Supabase auth policies in new tab",
    });
  };

  const filteredUsers = users.filter(user =>
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <UserCheck className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">{users.filter(u => u.full_name).length}</div>
                <div className="text-sm text-muted-foreground">Complete Profiles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Shield className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">Admin Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supabase Management Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Advanced User Management
          </CardTitle>
          <CardDescription>
            Direct access to Supabase dashboard for advanced user operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Button 
              onClick={openSupabaseUsers}
              className="h-16 flex flex-col gap-1"
            >
              <ExternalLink size={18} />
              <span className="font-medium">Manage Auth Users</span>
              <span className="text-xs opacity-80">Suspend, Delete, Reset</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={openSupabasePolicies}
              className="h-16 flex flex-col gap-1"
            >
              <Shield size={18} />
              <span className="font-medium">Security Policies</span>
              <span className="text-xs opacity-60">RLS & Permissions</span>
            </Button>
          </div>
          
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Advanced Actions:</strong> Use Supabase dashboard to suspend users, delete accounts, 
              view login history, reset passwords, and manage user permissions directly from Auth panel.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all registered users and their profiles
              </CardDescription>
            </div>
            <Button onClick={fetchUsers} variant="outline" size="sm">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6 max-w-sm">
            <Search size={20} className="text-muted-foreground" />
            <Input
              placeholder="Search users by name, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || 'No Name'}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {user.id.substring(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.phone || 'No Phone'}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm truncate">
                        {user.address || 'No Address'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.full_name ? "default" : "secondary"}>
                        {user.full_name ? "Active" : "Incomplete"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No users found matching your search.' : 'No registered users yet.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={showUserDetail} onOpenChange={setShowUserDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information and purchase history for {selectedUser?.full_name || 'this user'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-sm">{selectedUser.full_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-sm">{selectedUser.phone || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-sm">{selectedUser.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User ID</label>
                      <p className="text-sm font-mono">{selectedUser.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Joined</label>
                      <p className="text-sm">{new Date(selectedUser.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Purchase History ({userPurchases.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {userPurchases.length > 0 ? (
                    <div className="space-y-3">
                      {userPurchases.map((purchase) => (
                        <div key={purchase.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">Order #{purchase.id.substring(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(purchase.order_date).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">Rp {purchase.total.toLocaleString()}</p>
                              <Badge variant={purchase.status === 'delivered' ? 'default' : 'secondary'}>
                                {purchase.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm">Payment: {purchase.payment_method}</p>
                          {purchase.items && (
                            <p className="text-sm text-muted-foreground">
                              Items: {Array.isArray(purchase.items) ? purchase.items.length : 'Multiple'}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No purchases yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update user profile information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update User
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
