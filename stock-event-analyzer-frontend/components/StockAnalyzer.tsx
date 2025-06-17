import SearchBar from "./SearchBar";
import EventResult from "./EventResult";
import StockChart from "./StockChart";
import NewsArticle from "./NewsArticle";
import { useState, useCallback, useEffect } from "react";
import AuthNav from "./auth/AuthNav";

// Import the StockData interface from StockChart
import type { StockData } from "./StockChart";

// Updated tab types to include all possible tabs
type ActiveTab = 'search' | 'historical' | 'news' | 'charts';

// Define example searches to display on the home page
const exampleSearches = [
  {
    query: "2008 Financial Crisis",
    description: "How the Lehman Brothers collapse impacted the market",
    icon: "💹"
  },
  {
    query: "COVID-19 Pandemic",
    description: "Market reaction to global health emergency",
    icon: "🦠"
  },
  {
    query: "Tech Bubble Burst",
    description: "The dot-com crash of 2000",
    icon: "💻"
  },
  {
    query: "Bitcoin Halving",
    description: "Effects of cryptocurrency market cycles",
    icon: "₿"
  },
  {
    query: "Brexit Vote",
    description: "Market impact of the UK leaving the EU",
    icon: "🇪🇺"
  }
];

// Define article interface
interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
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
  
  // News articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  
  // Stock chart state - properly typed now
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [animatedIndex, setAnimatedIndex] = useState(-1);

  // Animate example search cards sequentially on load
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < exampleSearches.length) {
        setAnimatedIndex(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, []);

  const handleSearchResults = async (data: any) => {
    setSearchResults(data);
    setHasSearched(true);
    setActiveTab('historical');

    if (data?.event) {
      // Fetch related news articles
      await fetchNewsArticles(data.event);
    }
  };

  const fetchNewsArticles = async (eventQuery: string) => {
    setIsLoadingNews(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/news-articles?query=${encodeURIComponent(eventQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      } else {
        console.error('Failed to fetch news articles');
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching news articles:', error);
      setArticles([]);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Handle user selecting an example search
  const handleExampleSearch = (query: string) => {
    setSearchInput(query);
    // Trigger search after a brief delay to show the text change
    setTimeout(() => {
      const searchEvent = new Event('submit', { bubbles: true });
      document.querySelector('form')?.dispatchEvent(searchEvent);
    }, 100);
  };

  // Get the event date from the search results (for chart data)
  const getEventDate = (data: any): string | undefined => {
    if (!data) return undefined;
    return data.date;
  };

  // Load stock chart data when a search is performed
  useEffect(() => {
    const fetchStockData = async () => {
      if (!searchResults) return;
      
      const eventDate = getEventDate(searchResults);
      if (!eventDate) return;
      
      try {
        console.log("Fetching stock data for date:", eventDate);
        const response = await fetch(`${getApiBaseUrl()}/api/sp500-data?startDate=${encodeURIComponent(eventDate)}`);
        if (response.ok) {
          const responseData = await response.json();
          console.log("Stock data received:", responseData);
          
          // The API returns data in a nested 'data' property
          const stockData = responseData.data;
          
          console.log("Data structure:", {
            hasOneWeek: Array.isArray(stockData?.oneWeek),
            oneWeekLength: stockData?.oneWeek?.length,
            hasOneMonth: Array.isArray(stockData?.oneMonth),
            oneMonthLength: stockData?.oneMonth?.length,
            hasThreeMonths: Array.isArray(stockData?.threeMonths),
            threeMonthsLength: stockData?.threeMonths?.length,
            hasSixMonths: Array.isArray(stockData?.sixMonths),
            sixMonthsLength: stockData?.sixMonths?.length
          });
          
          setStockData(stockData);
        } else {
          console.error('Failed to fetch stock data');
          setStockData(null);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setStockData(null);
      }
    };
    
    fetchStockData();
  }, [searchResults]);

  // Reset search state when clicking back to search
  const handleBackToSearch = () => {
    setActiveTab('search');
    setHasSearched(false);
    setSearchResults(null);
    setArticles([]);
    setStockData(null);
    setSearchInput("");
  };

  // Handle tab changes
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Header bar with navigation - full width and extra padding */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-2 mb-10 z-10">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
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
        {/* Header Section with animated text */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-3">
            <h1 className="text-6xl font-extrabold tracking-tight relative z-10">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 animate-gradient-x">
                Intelligen<span className="text-white font-black">T</span>rader
              </span>
            </h1>
            <div className="absolute -inset-1 bg-blue-500/10 blur-xl rounded-full animate-pulse"></div>
          </div>
          <p className="text-xl text-blue-200 mb-6 max-w-2xl mx-auto">
            <span className="block mb-2 transition-all duration-700 ease-in-out transform hover:scale-105">Discover how key events impact the market.</span>
            <span className="block mt-2 transition-all duration-700 ease-in-out transform hover:translate-x-2">Search for events and analyze their market effects instantly.</span>
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
                <div className="mb-10 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-xl blur-md"></div>
                  <div className="relative">
                    <SearchBar 
                      onSearchResults={handleSearchResults} 
                      onLoading={handleLoading} 
                      searchValue={searchInput}
                      setSearchValue={setSearchInput}
                    />
                  </div>
                </div>

                {/* Example searches section */}
                <div className="mt-12">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Try searching for these events:
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exampleSearches.map((example, index) => (
                      <div 
                        key={index}
                        onClick={() => handleExampleSearch(example.query)}
                        className={`bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-4 cursor-pointer hover:bg-black/40 transition-all duration-300 transform hover:scale-105 hover:border-blue-500/50 ${index <= animatedIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start">
                          <span className="text-3xl mr-3">{example.icon}</span>
                          <div>
                            <h3 className="text-white font-medium">{example.query}</h3>
                            <p className="text-blue-200/70 text-sm mt-1">{example.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loading state */}
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
                {articles.length > 0 ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-3">
                      Related News Articles
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                      {articles.map((article, index) => (
                        <NewsArticle 
                          key={`article-${index}`}
                          article={article}
                          isHistorical={false}
                        />
                      ))}
                    </div>
                  </div>
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
                  <>
                    <div className="mb-4 p-4 bg-black/20 rounded-xl">
                      <h3 className="text-white font-medium">Debug Info:</h3>
                      <pre className="text-xs text-blue-200 overflow-auto max-h-40">
                        {JSON.stringify({
                          stockDataType: typeof stockData,
                          hasData: !!stockData,
                          hasOneWeek: Array.isArray(stockData.oneWeek),
                          oneWeekLength: stockData.oneWeek?.length || 0,
                          hasOneMonth: Array.isArray(stockData.oneMonth),
                          oneMonthLength: stockData.oneMonth?.length || 0,
                          hasThreeMonths: Array.isArray(stockData.threeMonths),
                          threeMonthsLength: stockData.threeMonths?.length || 0,
                          hasSixMonths: Array.isArray(stockData.sixMonths),
                          sixMonthsLength: stockData.sixMonths?.length || 0
                        }, null, 2)}
                      </pre>
                    </div>
                    <StockChart data={stockData} eventDate={getEventDate(searchResults)} />
                  </>
                ) : (
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
                    <svg className="w-12 h-12 mx-auto text-blue-400/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">No Chart Data Available</h3>
                    <p className="text-blue-200/70">We couldn't load stock chart data for this event.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add animated keyframes for the floating particles and blob animation */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }
        
        @keyframes blob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </div>
  );
} 