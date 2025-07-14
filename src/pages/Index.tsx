import React, { useState, useMemo, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ItemCard from '../components/ItemCard';
import PromotionBox from '../components/PromotionBox';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  type: string;
  description: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }
      
      return data as Item[];
    }
  });

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesItemType = itemTypeFilter === "all" || item.type === itemTypeFilter;
      
      let matchesPrice = true;
      if (priceRange !== "all") {
        const price = item.price;
        switch (priceRange) {
          case "0-500000":
            matchesPrice = price >= 0 && price <= 500000;
            break;
          case "500000-2000000":
            matchesPrice = price >= 500000 && price <= 2000000;
            break;
          case "2000000-5000000":
            matchesPrice = price >= 2000000 && price <= 5000000;
            break;
          case "5000000+":
            matchesPrice = price >= 5000000;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesItemType && matchesPrice;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchQuery, categoryFilter, itemTypeFilter, sortBy, priceRange]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, itemTypeFilter, sortBy, priceRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900 font-poppins">
      <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">ITEMKU</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Your Ultimate Gaming Marketplace</p>
          </div>
          <div className="w-full lg:w-auto">
            <Navigation />
          </div>
        </div>
        
        <PromotionBox />
        
        <div className="flex flex-col gap-3 md:gap-4 mb-4">
          <SearchBar onSearch={setSearchQuery} />
          <FilterBar 
            onCategoryChange={setCategoryFilter}
            onItemTypeChange={setItemTypeFilter}
            onSortChange={setSortBy}
            onPriceRangeChange={setPriceRange}
          />
        </div>

        <div className="mb-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 px-2 md:px-0">
          Showing {displayedItems.length} of {filteredAndSortedItems.length} items (Page {currentPage} of {totalPages})
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedItems.map(item => (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              description={item.description}
            />
          ))}
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No items found matching your criteria.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className={
                    currentPage === pageNum
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
