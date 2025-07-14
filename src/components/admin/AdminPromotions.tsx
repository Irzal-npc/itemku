
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Edit, Trash2, ExternalLink, Users, Percent, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  target_users: string;
  icon_name: string;
  bg_color: string;
  icon_color: string;
  created_at: string;
  updated_at: string;
}

interface AdminPromotionsProps {
  onPromotionsChange?: (hasPromotions: boolean) => void;
}

const AdminPromotions = ({ onPromotionsChange }: AdminPromotionsProps) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [userCount, setUserCount] = useState(0);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      discount_percent: 10,
      start_date: '',
      end_date: '',
      target_users: 'all',
      icon_name: 'percent',
      bg_color: 'bg-orange-100 dark:bg-orange-900/20',
      icon_color: 'text-orange-600 dark:text-orange-400'
    }
  });

  useEffect(() => {
    fetchPromotions();
    fetchUserCount();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promotions:', error);
        onPromotionsChange?.(false);
        return;
      }

      setPromotions(data || []);
      onPromotionsChange?.(data ? data.length > 0 : false);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      onPromotionsChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCount = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (!error) {
        setUserCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  const handleCreatePromotion = async (values: any) => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([{
          title: values.title,
          description: values.description,
          discount_percent: values.discount_percent,
          start_date: values.start_date,
          end_date: values.end_date,
          target_users: values.target_users,
          icon_name: values.icon_name,
          bg_color: values.bg_color,
          icon_color: values.icon_color,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating promotion:', error);
        toast({
          title: "Error",
          description: "Failed to create promotion",
          variant: "destructive",
        });
        return;
      }

      await fetchPromotions();
      setShowCreateDialog(false);
      form.reset();
      
      toast({
        title: "Success",
        description: "Promotion created successfully",
      });
    } catch (error) {
      console.error('Error creating promotion:', error);
      toast({
        title: "Error",
        description: "Failed to create promotion",
        variant: "destructive",
      });
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset({
      title: promotion.title,
      description: promotion.description,
      discount_percent: promotion.discount_percent,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      target_users: promotion.target_users,
      icon_name: promotion.icon_name,
      bg_color: promotion.bg_color,
      icon_color: promotion.icon_color
    });
    setShowCreateDialog(true);
  };

  const handleUpdatePromotion = async (values: any) => {
    if (!editingPromotion) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .update({
          title: values.title,
          description: values.description,
          discount_percent: values.discount_percent,
          start_date: values.start_date,
          end_date: values.end_date,
          target_users: values.target_users,
          icon_name: values.icon_name,
          bg_color: values.bg_color,
          icon_color: values.icon_color,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPromotion.id);

      if (error) {
        console.error('Error updating promotion:', error);
        toast({
          title: "Error",
          description: "Failed to update promotion",
          variant: "destructive",
        });
        return;
      }

      await fetchPromotions();
      setShowCreateDialog(false);
      setEditingPromotion(null);
      form.reset();
      
      toast({
        title: "Success",
        description: "Promotion updated successfully",
      });
    } catch (error) {
      console.error('Error updating promotion:', error);
      toast({
        title: "Error",
        description: "Failed to update promotion",
        variant: "destructive",
      });
    }
  };

  const handleDeletePromotion = async (promotionId: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId);

      if (error) {
        console.error('Error deleting promotion:', error);
        toast({
          title: "Error",
          description: "Failed to delete promotion",
          variant: "destructive",
        });
        return;
      }

      await fetchPromotions();
      
      toast({
        title: "Success",
        description: "Promotion deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast({
        title: "Error",
        description: "Failed to delete promotion",
        variant: "destructive",
      });
    }
  };

  const togglePromotionStatus = async (promotionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', promotionId);

      if (error) {
        console.error('Error updating promotion status:', error);
        toast({
          title: "Error",
          description: "Failed to update promotion status",
          variant: "destructive",
        });
        return;
      }

      await fetchPromotions();
      
      toast({
        title: "Success",
        description: "Promotion status updated",
      });
    } catch (error) {
      console.error('Error updating promotion status:', error);
      toast({
        title: "Error",
        description: "Failed to update promotion status",
        variant: "destructive",
      });
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
      {/* Promotion Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                <Percent className="text-blue-600 dark:text-blue-400" size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-lg md:text-2xl font-bold">{promotions.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/20 rounded-lg flex-shrink-0">
                <Target className="text-green-600 dark:text-green-400" size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-lg md:text-2xl font-bold">{promotions.filter(p => p.is_active).length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                <Users className="text-purple-600 dark:text-purple-400" size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-lg md:text-2xl font-bold">{userCount}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex-shrink-0">
                <Calendar className="text-orange-600 dark:text-orange-400" size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-lg md:text-2xl font-bold">
                  {promotions.filter(p => new Date(p.end_date) > new Date()).length}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Promotions Management</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Create and manage promotional campaigns for your users
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={openSupabaseProjects} size="sm" className="w-full sm:w-auto">
                <ExternalLink size={14} className="mr-2" />
                <span className="hidden sm:inline">Supabase Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPromotion(null)} className="w-full sm:w-auto">
                    <Plus size={16} className="mr-2" />
                    Add Promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPromotion ? 'Update promotion details' : 'Create a new promotional campaign'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(editingPromotion ? handleUpdatePromotion : handleCreatePromotion)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Promotion Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter promotion title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter promotion description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="discount_percent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount %</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="100" 
                                  placeholder="10" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="icon_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Icon</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="percent">Percent</SelectItem>
                                  <SelectItem value="gift">Gift</SelectItem>
                                  <SelectItem value="star">Star</SelectItem>
                                  <SelectItem value="zap">Flash</SelectItem>
                                  <SelectItem value="crown">Crown</SelectItem>
                                  <SelectItem value="trophy">Trophy</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="target_users"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Users</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select target users" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="new">New Users</SelectItem>
                                <SelectItem value="returning">Returning Users</SelectItem>
                                <SelectItem value="vip">VIP Users</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => {
                          setShowCreateDialog(false);
                          setEditingPromotion(null);
                          form.reset();
                        }}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingPromotion ? 'Update' : 'Create'} Promotion
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {promotions.length > 0 ? (
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <Card key={promotion.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{promotion.title}</h3>
                          <div className="flex gap-2">
                            {promotion.discount_percent > 0 && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                {promotion.discount_percent}% OFF
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              promotion.is_active 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                                : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
                            }`}>
                              {promotion.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{promotion.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Start:</span>
                            <p>{new Date(promotion.start_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">End:</span>
                            <p>{new Date(promotion.end_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target:</span>
                            <p className="capitalize">{promotion.target_users} Users</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <p>{new Date(promotion.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePromotionStatus(promotion.id, promotion.is_active)}
                        >
                          {promotion.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditPromotion(promotion)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePromotion(promotion.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mb-4">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                  <Percent size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Promotions Yet</h3>
                <p>Create your first promotional campaign to engage users</p>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPromotion(null)}>
                    <Plus size={16} className="mr-2" />
                    Create First Promotion
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPromotions;
