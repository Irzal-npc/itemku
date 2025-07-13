
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { usePurchaseHistory } from '../contexts/PurchaseHistoryContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Navigation from '../components/Navigation';

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  const { addPurchase } = usePurchaseHistory();
  const { addNotification } = useNotifications();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = 0;
    const tax = subtotal * 0.25;
    setFinalTotal(subtotal - discount + tax);
  }, [cartItems]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Required",
        description: "Please select a payment method before placing your order.",
        variant: "destructive",
      });
      return;
    }

    const purchase = {
      items: cartItems.map(item => ({
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: finalTotal,
      status: 'pending' as const,
      orderDate: new Date(),
      paymentMethod,
    };

    addPurchase(purchase);
    clearCart();

    addNotification({
      type: 'success',
      title: 'Purchase Successful',
      message: `Your purchase has been completed. Processing game items... Total: ${formatRupiah(finalTotal)}`,
    });

    setTimeout(() => {
      addNotification({
        type: 'info',
        title: 'Items Added to Game',
        message: 'Your purchased items have been successfully added to your game inventory!',
      });
    }, 3000);

    toast({
      title: "Purchase completed successfully!",
      description: `Your game items are being processed. Total: ${formatRupiah(finalTotal)}`,
    });

    navigate('/');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0;
  const tax = subtotal * 0.25;

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      
      <div className="container mx-auto pt-10 px-4">
        <div className="flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden my-10 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="w-full lg:w-3/4 px-6 lg:px-10 py-10">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-8">
              <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">Checkout</h1>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Payment Method</h2>
              <RadioGroup onValueChange={setPaymentMethod} className="flex flex-col gap-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <RadioGroupItem value="credit-card" id="r1" />
                  <Label htmlFor="r1" className="text-gray-900 dark:text-white cursor-pointer">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <RadioGroupItem value="paypal" id="r2" />
                  <Label htmlFor="r2" className="text-gray-900 dark:text-white cursor-pointer">PayPal</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <RadioGroupItem value="gopay" id="r3" />
                  <Label htmlFor="r3" className="text-gray-900 dark:text-white cursor-pointer">GoPay</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div id="summary" className="w-full lg:w-1/4 px-6 lg:px-8 py-10 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
            <h1 className="font-semibold text-2xl border-b border-gray-200 dark:border-gray-600 pb-8 text-gray-900 dark:text-white">Order Summary</h1>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Discount</span>
                <span>-{formatRupiah(discount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Tax (25%)</span>
                <span>{formatRupiah(tax)}</span>
              </div>
              <div className="flex font-semibold justify-between py-6 text-sm uppercase border-t border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                <span>Total</span>
                <span>{formatRupiah(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-10">
          <Button 
            className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 font-semibold py-3 px-8 text-sm text-white uppercase transition-colors" 
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
