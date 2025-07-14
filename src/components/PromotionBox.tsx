
import React, { useState, useEffect } from 'react';
import { Percent, Gift, Star, Zap, Crown, Trophy, LucideIcon } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import PromotionCard from './PromotionCard';
import { supabase } from '@/integrations/supabase/client';

// Icon mapping for the promotions
const iconMap: { [key: string]: LucideIcon } = {
  'percent': Percent,
  'gift': Gift,
  'star': Star,
  'zap': Zap,
  'crown': Crown,
  'trophy': Trophy,
};

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

const PromotionBox = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching promotions:', error);
        return;
      }

      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Latest Promotions
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading promotions...</div>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Latest Promotions
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">No active promotions available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Latest Promotions
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don't miss out on these amazing deals!
        </p>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {promotions.map((promotion) => (
            <CarouselItem key={promotion.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <PromotionCard
                title={promotion.title}
                description={promotion.description}
                icon={iconMap[promotion.icon_name] || Percent}
                bgColor={promotion.bg_color}
                iconColor={promotion.icon_color}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" />
        <CarouselNext className="right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" />
      </Carousel>
    </div>
  );
};

export default PromotionBox;
