
import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PurchaseItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Purchase {
  id: string;
  items: PurchaseItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  paymentMethod: string;
}

interface PurchaseHistoryContextType {
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id'>) => Promise<void>;
  updatePurchaseStatus: (id: string, status: Purchase['status']) => Promise<void>;
  isLoading: boolean;
}

const PurchaseHistoryContext = createContext<PurchaseHistoryContextType | undefined>(undefined);

export const usePurchaseHistory = () => {
  const context = useContext(PurchaseHistoryContext);
  if (!context) {
    throw new Error('usePurchaseHistory must be used within a PurchaseHistoryProvider');
  }
  return context;
};

export const PurchaseHistoryProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch purchases from Supabase
  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('purchase_history')
        .select('*')
        .eq('user_id', user.id)
        .order('order_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching purchases:', error);
        throw error;
      }
      
      return data.map(purchase => ({
        id: purchase.id,
        items: (purchase.items as unknown) as PurchaseItem[], // Safe type conversion
        total: purchase.total,
        status: purchase.status as Purchase['status'],
        orderDate: new Date(purchase.order_date),
        deliveryDate: purchase.delivery_date ? new Date(purchase.delivery_date) : undefined,
        paymentMethod: purchase.payment_method
      }));
    },
    enabled: !!user?.id
  });

  // Add purchase mutation
  const addPurchaseMutation = useMutation({
    mutationFn: async (purchase: Omit<Purchase, 'id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('purchase_history')
        .insert({
          user_id: user.id,
          items: purchase.items as any, // Convert to Json type
          total: purchase.total,
          status: purchase.status,
          payment_method: purchase.paymentMethod,
          order_date: purchase.orderDate.toISOString(),
          delivery_date: purchase.deliveryDate?.toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast({
        title: "Purchase Created",
        description: "Your purchase has been recorded successfully!",
      });
    },
    onError: (error) => {
      console.error('Error adding purchase:', error);
      toast({
        title: "Error",
        description: "Failed to record purchase. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update purchase status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Purchase['status'] }) => {
      const { error } = await supabase
        .from('purchase_history')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
    onError: (error) => {
      console.error('Error updating purchase status:', error);
      toast({
        title: "Error",
        description: "Failed to update purchase status.",
        variant: "destructive",
      });
    }
  });

  const addPurchase = async (purchase: Omit<Purchase, 'id'>) => {
    await addPurchaseMutation.mutateAsync(purchase);
  };

  const updatePurchaseStatus = async (id: string, status: Purchase['status']) => {
    await updateStatusMutation.mutateAsync({ id, status });
  };

  return (
    <PurchaseHistoryContext.Provider
      value={{
        purchases,
        addPurchase,
        updatePurchaseStatus,
        isLoading,
      }}
    >
      {children}
    </PurchaseHistoryContext.Provider>
  );
};
