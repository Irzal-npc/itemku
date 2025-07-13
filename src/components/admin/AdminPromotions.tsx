
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminPromotionsProps {
  onPromotionsChange?: (hasPromotions: boolean) => void;
}

const AdminPromotions = ({ onPromotionsChange }: AdminPromotionsProps) => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkPromotions();
  }, []);

  const checkPromotions = async () => {
    try {
      // Since there's no promotions table in the database yet,
      // we'll assume there are no promotions for now
      setPromotions([]);
      onPromotionsChange?.(false);
    } catch (error) {
      console.error('Error:', error);
      onPromotionsChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  const openSupabaseProjects = () => {
    window.open('https://supabase.com/dashboard/projects', '_blank');
    toast({
      title: "Supabase Dashboard",
      description: "Opening Supabase dashboard in new tab",
    });
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading promotions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Promotions Management</CardTitle>
          <CardDescription>
            Create and manage promotional campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Manage your promotional campaigns and discounts
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={openSupabaseProjects}>
                <ExternalLink size={16} className="mr-2" />
                Supabase Dashboard
              </Button>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Promotion
              </Button>
            </div>
          </div>

          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                <Plus size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Promotions Yet</h3>
              <p>Create your first promotional campaign to boost sales</p>
            </div>
            <Button>
              <Plus size={16} className="mr-2" />
              Create First Promotion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Management Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle>User Management Shortcuts</CardTitle>
          <CardDescription>
            Quick access to Supabase user management features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => window.open('https://supabase.com/dashboard/project/_/auth/users', '_blank')}
            >
              <ExternalLink size={20} />
              <span>Manage Users in Supabase</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => window.open('https://supabase.com/dashboard/project/_/auth/policies', '_blank')}
            >
              <ExternalLink size={20} />
              <span>User Policies & Security</span>
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Quick Actions:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Suspend users directly from Supabase Auth dashboard</li>
              <li>• Delete user accounts and associated data</li>
              <li>• View user activity and login history</li>
              <li>• Manage user roles and permissions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPromotions;
