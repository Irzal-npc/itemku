
import React from 'react';
import { Button } from "./ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart, formatRupiah } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-white dark:bg-gray-900 flex flex-col h-full">
        <SheetHeader className="border-b dark:border-gray-700 pb-4">
          <SheetTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ShoppingCart size={20} />
            Shopping Cart
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your shopping cart items
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 border-b dark:border-gray-700 pb-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{formatRupiah(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 dark:border-gray-600 dark:hover:bg-gray-700"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 dark:border-gray-600 dark:hover:bg-gray-700"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{formatRupiah(item.price * item.quantity)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t dark:border-gray-700 pt-4 space-y-4 bg-white dark:bg-gray-900">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white">
              <span>Total: {formatRupiah(getTotalPrice())}</span>
            </div>
            <div className="space-y-2">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
              <Button 
                variant="outline" 
                className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
