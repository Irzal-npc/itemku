
import React, { useEffect, useRef } from 'react';
import { usePurchaseHistory } from '../contexts/PurchaseHistoryContext';
import { Button } from "../components/ui/button";
import { ShoppingBag, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useLanguage } from '../contexts/LanguageContext';

const PurchaseHistory = () => {
  const { purchases, updatePurchaseStatus } = usePurchaseHistory();
  const { t } = useLanguage();
  const hasUpdatedRef = useRef(false);

  // Update all purchases to delivered status on component mount, but only once
  useEffect(() => {
    if (!hasUpdatedRef.current && purchases.length > 0) {
      const purchasesToUpdate = purchases.filter(purchase => purchase.status !== 'delivered');
      
      if (purchasesToUpdate.length > 0) {
        hasUpdatedRef.current = true;
        purchasesToUpdate.forEach(purchase => {
          updatePurchaseStatus(purchase.id, 'delivered');
        });
      }
    }
  }, [purchases.length]); // Only depend on the length, not the entire purchases array

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusText = (status: string) => {
    // Always return "Success" regardless of the actual status
    return 'Success';
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900 font-poppins transition-colors duration-200">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">ITEMKU</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('nav.history')}</p>
          </div>
          <Navigation />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <ShoppingBag size={24} />
            {t('nav.history')}
          </h2>

          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">No purchases yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {purchases.map(purchase => (
                <div
                  key={purchase.id}
                  className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Order #{purchase.id}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(purchase.orderDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Success
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {purchase.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity} × {formatRupiah(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatRupiah(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Payment: {purchase.paymentMethod}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      Total: {formatRupiah(purchase.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
