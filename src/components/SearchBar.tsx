
import React from 'react';
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full max-w-xl">
      <Input
        type="text"
        placeholder={t('home.search')}
        className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
    </div>
  );
};

export default SearchBar;
