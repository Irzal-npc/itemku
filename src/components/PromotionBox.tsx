
import React from 'react';
import { Percent, Gift, Star, Zap, Crown, Trophy } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import PromotionCard from './PromotionCard';

const PromotionBox = () => {
  const promotions = [
    {
      title: "Special Offer!",
      description: "Get 20% off on all items this week",
      icon: Percent,
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Free Gift!",
      description: "Buy 2 items and get 1 free bonus item",
      icon: Gift,
      bgColor: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Premium Items",
      description: "New premium collection now available",
      icon: Star,
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Flash Sale!",
      description: "Limited time offer - Up to 50% off",
      icon: Zap,
      bgColor: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400"
    },
    {
      title: "VIP Members",
      description: "Exclusive deals for VIP members only",
      icon: Crown,
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Top Rated",
      description: "Best selling items with 5-star ratings",
      icon: Trophy,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    }
  ];

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
          {promotions.map((promotion, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <PromotionCard
                title={promotion.title}
                description={promotion.description}
                icon={promotion.icon}
                bgColor={promotion.bgColor}
                iconColor={promotion.iconColor}
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
