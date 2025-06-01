import SearchBar from "./SearchBar";
import EventResult from "./EventResult";
import StockChart from "./StockChart";
import NewsArticles from "./NewsArticles";
import { useState, useCallback, useEffect } from "react";
import AuthNav from "./auth/AuthNav";

// Updated tab types to include all possible tabs
type ActiveTab = 'search' | 'historical' | 'news' | 'charts';

// Define article interface
interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string;
}

// Function to get the API base URL
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
};

export default function StockAnalyzer() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  
  // Track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);
  
  // News article state
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  
  // Stock chart state
  const [stockData, setStockData] = useState(null);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  const handleSearchResults = async (data: any) => {
    setSearchResults(data);
    
    // If we got valid event data, mark as searched and show historical tab
    if (data && !data.error) {
      setHasSearched(true);
      setActiveTab('historical');
      
      // Fetch news data
      await fetchNewsArticles(data.event);
      
      // Fetch stock data using the event date
      const eventDate = getEventDate(data);
      if (eventDate) {
        handleFetchStockData(eventDate);
      }
    }
  };

  const fetchNewsArticles = async (eventQuery: string) => {
    setIsLoadingNews(true);
    try {
      // Add a try-catch around the fetch request
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/news-articles?query=${encodeURIComponent(eventQuery)}`);
        if (!response.ok) {
          console.error(`News API HTTP error! status: ${response.status}`);
          setArticle(null);
          return; // Exit early
        }
        const newsData = await response.json();
        if (newsData.article) {
          setArticle(newsData.article);
        } else {
          setArticle(null);
        }
      } catch (fetchError) {
        console.error('Failed to connect to news API:', fetchError);
        setArticle(null);
      }
    } catch (error) {
      console.error('Failed to fetch news article:', error);
      setArticle(null);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleFetchStockData = useCallback(async (startDate: string) => {
    setIsLoadingStock(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/sp500-data?startDate=${startDate}`);
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
  const getEventDate = (data: any): string | undefined => {
    if (!data || data.error) return undefined;
    
    const eventDate = data.date;
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

  // Reset search state when clicking back to search
  const handleBackToSearch = () => {
    setActiveTab('search');
    setHasSearched(false);
    setSearchResults(null);
    setArticle(null);
    setStockData(null);
  };

  // Handle tab changes
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-6 relative overflow-hidden">
      {/* Static background elements */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Header bar with navigation - full width and extra padding */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-2 mb-10 z-10">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white ml-3 hidden sm:block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
                Intelligen<span className="text-white font-black">T</span>rader
              </span>
            </h2>
          </div>
          <AuthNav />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="w-full max-w-4xl z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
              Intelligen<span className="text-white font-black">T</span>rader
            </span>
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Discover how key events impact the market.
            <span className="block mt-2">Search for events and analyze their market effects instantly.</span>
          </p>
        </div>
        
        {/* Main card */}
        <div className="bg-black/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            {!hasSearched ? (
              // Only show Historical Events search tab when no search has been performed
              <button
                className="px-8 py-5 font-medium text-lg transition-all flex-1 text-white bg-white/5 border-b-2 border-blue-500"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Historical Events
                </span>
              </button>
            ) : (
              // Show all tabs after search is performed
              <>
                {/* Back to Search button */}
                <button
                  onClick={handleBackToSearch}
                  className="px-6 py-5 font-medium text-lg transition-all text-blue-200/70 hover:text-blue-200 hover:bg-white/5"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    New Search
                  </span>
                </button>

                {/* Historical Data tab */}
                <button
                  onClick={() => handleTabChange('historical')}
                  className={`px-6 py-5 font-medium text-lg transition-all flex-1 ${
                    activeTab === 'historical'
                      ? 'text-white bg-white/5 border-b-2 border-blue-500'
                      : 'text-blue-200/70 hover:text-blue-200 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Historical Data
                  </span>
                </button>
                
                {/* News tab */}
                <button
                  onClick={() => handleTabChange('news')}
                  className={`px-6 py-5 font-medium text-lg transition-all flex-1 ${
                    activeTab === 'news'
                      ? 'text-white bg-white/5 border-b-2 border-purple-500'
                      : 'text-blue-200/70 hover:text-blue-200 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    News
                  </span>
                </button>
                
                {/* Charts tab */}
                <button
                  onClick={() => handleTabChange('charts')}
                  className={`px-6 py-5 font-medium text-lg transition-all flex-1 ${
                    activeTab === 'charts'
                      ? 'text-white bg-white/5 border-b-2 border-indigo-500'
                      : 'text-blue-200/70 hover:text-blue-200 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    S&P 500 Charts
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Initial Search Area */}
            {!hasSearched && (
              <div>
                <SearchBar onSearchResults={handleSearchResults} onLoading={handleLoading} />
                {isLoading && (
                  <div className="mt-8 bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 flex items-center justify-center">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg text-blue-200">Analyzing market events...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Historical Data Tab Content */}
            {hasSearched && activeTab === 'historical' && searchResults && !isLoading && (
              <div>
                <EventResult 
                  data={searchResults}
                  isLoading={false}
                />
              </div>
            )}

            {/* News Tab Content */}
            {hasSearched && activeTab === 'news' && (
              <div>
                {article ? (
                  <NewsArticles 
                    article={article}
                    isLoading={isLoadingNews}
                  />
                ) : isLoadingNews ? (
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 flex items-center justify-center">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg text-blue-200">Loading related news...</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
                    <svg className="w-12 h-12 mx-auto text-blue-400/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">No News Available</h3>
                    <p className="text-blue-200/70">We couldn't find any related news articles for this event.</p>
                  </div>
                )}
              </div>
            )}

            {/* Charts Tab Content */}
            {hasSearched && activeTab === 'charts' && (
              <div>
                {stockData ? (
                  <StockChart 
                    onFetchData={handleFetchStockData}
                    stockData={stockData}
                    isLoading={isLoadingStock}
                    symbol="SPY"
                    eventDate={searchResults ? getEventDate(searchResults) : undefined}
                  />
                ) : isLoadingStock ? (
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 flex items-center justify-center">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg text-blue-200">Loading market data...</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
                    <svg className="w-12 h-12 mx-auto text-blue-400/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">No Chart Data Available</h3>
                    <p className="text-blue-200/70">We couldn't generate chart data for this event. Please try searching for a different event.</p>
                    <button 
                      onClick={() => searchResults && handleFetchStockData(getEventDate(searchResults) || '2020-01-01')}
                      className="mt-4 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-1 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-blue-200">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>Real-time market analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
} 