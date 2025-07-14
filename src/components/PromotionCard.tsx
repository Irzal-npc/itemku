
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PromotionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor?: string;
  iconColor?: string;
}

const PromotionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  bgColor = "bg-primary/10 dark:bg-primary/20",
  iconColor = "text-primary dark:text-primary"
}: PromotionCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm h-24 md:h-32 flex items-center">
      <div className="flex items-center gap-2 md:gap-4 w-full">
        <div className={`${bgColor} rounded-full p-2 md:p-3 flex-shrink-0`}>
          <Icon className={iconColor} size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
