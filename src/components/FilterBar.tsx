
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onPriceRangeChange: (priceRange: string) => void;
  onItemTypeChange: (itemType: string) => void;
}

const FilterBar = ({ onCategoryChange, onSortChange, onPriceRangeChange, onItemTypeChange }: FilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <SelectValue placeholder="All Games" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <SelectItem value="all">All Games</SelectItem>
          <SelectItem value="skyrim">The Elder Scrolls V: Skyrim</SelectItem>
          <SelectItem value="halo">Halo Series</SelectItem>
          <SelectItem value="minecraft">Minecraft</SelectItem>
          <SelectItem value="counter-strike">Counter-Strike</SelectItem>
          <SelectItem value="valorant">Valorant</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onItemTypeChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <SelectValue placeholder="Item Type" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <SelectItem value="all">All Items</SelectItem>
          <SelectItem value="weapon">Weapons</SelectItem>
          <SelectItem value="armor">Armor</SelectItem>
          <SelectItem value="potion">Potions</SelectItem>
          <SelectItem value="tool">Tools</SelectItem>
          <SelectItem value="food">Food</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onPriceRangeChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="0-500000">Rp 0 - Rp 500.000</SelectItem>
          <SelectItem value="500000-2000000">Rp 500.000 - Rp 2.000.000</SelectItem>
          <SelectItem value="2000000-5000000">Rp 2.000.000 - Rp 5.000.000</SelectItem>
          <SelectItem value="5000000+">Rp 5.000.000+</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
          <SelectItem value="name-asc">Name A-Z</SelectItem>
          <SelectItem value="name-desc">Name Z-A</SelectItem>
          <SelectItem value="price-asc">Price Low to High</SelectItem>
          <SelectItem value="price-desc">Price High to Low</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;
