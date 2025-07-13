
import React from 'react';
import { Button } from "./ui/button";
import { ShoppingCart, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface ItemCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const ItemCard = ({ id, name, price, image, description }: ItemCardProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleViewDetails = () => {
    navigate(`/item/${id}`);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-subtitle font-semibold mb-2 text-gray-800 dark:text-white">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{formatRupiah(price)}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            onClick={handleViewDetails}
            variant="outline"
            className="px-3 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/50"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
