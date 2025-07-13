
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, UserX, Edit, ExternalLink, Shield } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
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
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openSupabaseUsers = () => {
    window.open('https://supabase.com/dashboard/project/_/auth/users', '_blank');
    toast({
      title: "Supabase Users",
      description: "Opening Supabase user management in new tab",
    });
  };

  const openSupabasePolicies = () => {
    window.open('https://supabase.com/dashboard/project/_/auth/policies', '_blank');
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
      {/* Supabase Management Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Supabase User Management
          </CardTitle>
          <CardDescription>
            Direct access to Supabase dashboard for advanced user management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Button 
              onClick={openSupabaseUsers}
              className="h-16 flex flex-col gap-1"
            >
              <ExternalLink size={18} />
              <span className="font-medium">Manage Users</span>
              <span className="text-xs opacity-80">Suspend & Delete</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={openSupabasePolicies}
              className="h-16 flex flex-col gap-1"
            >
              <Shield size={18} />
              <span className="font-medium">Auth Policies</span>
              <span className="text-xs opacity-60">Security Settings</span>
            </Button>
          </div>
          
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Quick Actions:</strong> Use Supabase dashboard to suspend users, delete accounts, view login history, and manage user permissions directly.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Users Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Users Overview</CardTitle>
          <CardDescription>
            View registered users and their basic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6 max-w-sm">
            <Search size={20} className="text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-sm">
                      {user.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{user.full_name || 'N/A'}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {user.address || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found. {searchTerm ? 'Try adjusting your search.' : 'No registered users yet.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
