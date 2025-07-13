
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { useCart } from '../contexts/CartContext';
import Navigation from '../components/Navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  type: string;
  description: string;
}

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Fetch item from Supabase instead of hardcoded array
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', parseInt(id))
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching item:', error);
        throw error;
      }
      
      return data as Item | null;
    },
    enabled: !!id
  });

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = () => {
    if (item) {
      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading item...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Item not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The item you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900 font-poppins">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary dark:text-purple-400 mb-2">ITEMKU</h1>
            <p className="text-gray-600 dark:text-gray-300">Trusted Gaming Item Platform</p>
          </div>
          <Navigation />
        </div>

        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-6 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-96 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
            </div>
            
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{item.name}</h1>
                <p className="text-lg text-primary dark:text-purple-400 font-bold mb-6">{formatRupiah(item.price)}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="inline-block bg-primary/10 dark:bg-purple-900/30 text-primary dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium capitalize border border-primary/20 dark:border-purple-700">
                    {item.category}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-primary/90 dark:bg-purple-600 dark:hover:bg-purple-700 text-white py-3"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
