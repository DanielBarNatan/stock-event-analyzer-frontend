import React, { useState } from "react";

interface SearchBarProps {
  onSearchResults: (data: any) => void;
  onLoading: (loading: boolean) => void;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
}

export default function SearchBar({ onSearchResults, onLoading, searchValue, setSearchValue }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Function to get the API base URL
  const getApiBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuery = searchValue || query;
    if (!currentQuery.trim()) return;

    setIsSearching(true);
    onLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/historical-event?query=${encodeURIComponent(currentQuery)}`);
      const data = await response.json();
      
      if (response.ok) {
        onSearchResults(data);
      } else {
        console.error('API Error:', data);
        onSearchResults({ error: data.error || 'Failed to fetch data' });
      }
    } catch (error) {
      console.error('Network error:', error);
      onSearchResults({ error: 'Failed to connect to server' });
    } finally {
      setIsSearching(false);
      onLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Use the external state if provided
    if (setSearchValue) {
      setSearchValue(value);
    } else {
      setQuery(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search events or stocks..."
          value={searchValue !== undefined ? searchValue : query}
          onChange={handleInputChange}
          disabled={isSearching}
          className="w-full h-14 px-5 pr-16 bg-black/20 text-white rounded-xl border border-white/10 outline-none transition-all focus:border-blue-500 placeholder-white/40 text-lg"
          aria-label="Search events or stocks"
        />
        <button 
          type="submit" 
          disabled={isSearching || !(searchValue || query).trim()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
} 