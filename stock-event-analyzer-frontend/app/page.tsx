"use client";

import SearchBar from "../components/SearchBar";
import EventResult from "../components/EventResult";
import StockChart from "../components/StockChart";
import { useState, useCallback, useEffect } from "react";

type ActiveTab = 'events' | 'stocks';

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');
  
  // Stock chart state
  const [stockData, setStockData] = useState(null);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [fromEventSearch, setFromEventSearch] = useState(false);

  const handleSearchResults = (data: any) => {
    setSearchResults(data);
    // If we got valid event data, switch to stocks tab and mark as from event search
    if (data && !data.error) {
      setActiveTab('stocks');
      setFromEventSearch(true);
    }
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleFetchStockData = useCallback(async (startDate: string) => {
    setIsLoadingStock(true);
    try {
      const response = await fetch(`http://localhost:4000/api/sp500-data?startDate=${startDate}`);
      const data = await response.json();
      
      if (response.ok) {
        setStockData(data.data);
      } else {
        console.error('Stock API Error:', data);
        setStockData(null);
      }
    } catch (error) {
      console.error('Network error:', error);
      setStockData(null);
    } finally {
      setIsLoadingStock(false);
    }
  }, []);

  // Parse event date for stock chart
  const getEventDate = (): string | undefined => {
    if (!searchResults || (searchResults as any).error) return undefined;
    
    const eventDate = (searchResults as any).date;
    if (!eventDate) return undefined;
    
    // Parse different date formats (YYYY, YYYY-MM, YYYY-MM-DD)
    let parsedDate = '';
    if (eventDate.length === 4) {
      // Year only - use January 1st
      parsedDate = `${eventDate}-01-01`;
    } else if (eventDate.length === 7) {
      // Year-Month - use 1st day of month
      parsedDate = `${eventDate}-01`;
    } else if (eventDate.length === 10) {
      // Full date
      parsedDate = eventDate;
    }
    
    return parsedDate;
  };

  // Reset fromEventSearch when manually switching tabs
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'events') {
      setFromEventSearch(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-tr from-blue-500 via-fuchsia-400 to-yellow-300 dark:from-blue-900 dark:via-fuchsia-900 dark:to-yellow-700 p-6">
      {/* Header Section */}
      <div className="w-full max-w-3xl bg-white/95 dark:bg-gray-900/90 rounded-4xl shadow-2xl px-12 py-20 flex flex-col items-center space-y-12 border-2 border-blue-200 dark:border-fuchsia-800 relative mt-10">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-3 rounded-full bg-gradient-to-r from-blue-500 via-fuchsia-400 to-yellow-300 dark:from-blue-700 dark:via-fuchsia-700 dark:to-yellow-500 shadow-lg"></div>
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-fuchsia-600 to-yellow-500 dark:from-blue-300 dark:via-fuchsia-400 dark:to-yellow-300 mb-4 drop-shadow-xl">Stock Event Analyzer</h1>
        <p className="text-2xl text-gray-800 dark:text-gray-100 mb-8 font-semibold max-w-2xl mx-auto text-center">
          Discover how key events impact the market.<br />
          <span className="text-fuchsia-600 dark:text-fuchsia-300">Search for events</span> and see their market effects instantly.
        </p>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-2 mb-6">
          <button
            onClick={() => handleTabChange('events')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-blue-500 via-fuchsia-500 to-yellow-400 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🔍 Historical Events
          </button>
          <button
            onClick={() => handleTabChange('stocks')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'stocks'
                ? 'bg-gradient-to-r from-blue-500 via-fuchsia-500 to-yellow-400 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            📈 S&P 500 Charts
          </button>
        </div>

        {/* Conditional Search Bar - Only show for events tab */}
        {activeTab === 'events' && (
          <div className="w-full flex justify-center">
            <SearchBar onSearchResults={handleSearchResults} onLoading={handleLoading} />
          </div>
        )}

        {/* Show search bar on stocks tab if we came from event search */}
        {activeTab === 'stocks' && fromEventSearch && (
          <div className="w-full flex justify-center">
            <SearchBar onSearchResults={handleSearchResults} onLoading={handleLoading} />
          </div>
        )}
      </div>

      {/* Results Section - Events */}
      {activeTab === 'events' && (isLoading || searchResults) && (
        <div className="mt-12 w-full flex justify-center">
          <EventResult data={searchResults} isLoading={isLoading} />
        </div>
      )}

      {/* Results Section - Stock Chart */}
      {activeTab === 'stocks' && (
        <>
          {/* Show event result if we came from event search */}
          {fromEventSearch && searchResults && !(searchResults as any).error && !isLoading && (
            <div className="mt-12 w-full flex justify-center">
              <EventResult data={searchResults} isLoading={false} />
            </div>
          )}
          
          {/* Stock Chart */}
          <div className="mt-12 w-full flex justify-center">
            <StockChart 
              onFetchData={handleFetchStockData}
              stockData={stockData}
              isLoading={isLoadingStock}
              symbol="SPY"
              eventDate={fromEventSearch ? getEventDate() : undefined}
            />
          </div>
        </>
      )}
    </div>
  );
}

