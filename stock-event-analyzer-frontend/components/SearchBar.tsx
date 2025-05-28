import React, { useState } from "react";

interface SearchBarProps {
  onSearchResults: (data: any) => void;
  onLoading: (loading: boolean) => void;
}

export default function SearchBar({ onSearchResults, onLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    onLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/historical-event?query=${encodeURIComponent(query)}`);
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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl flex items-center bg-white dark:bg-gray-800 rounded-full shadow-2xl px-8 py-5 border-2 border-fuchsia-300 dark:border-fuchsia-700 focus-within:ring-4 focus-within:ring-fuchsia-400/40 transition-all">
      <input
        type="text"
        placeholder="Search events or stocks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isSearching}
        className="flex-grow bg-transparent outline-none text-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 disabled:opacity-50"
        aria-label="Search events or stocks"
      />
      <button 
        type="submit" 
        disabled={isSearching || !query.trim()}
        className="ml-5 p-4 rounded-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-yellow-400 hover:from-blue-600 hover:via-fuchsia-600 hover:to-yellow-500 text-white text-2xl font-bold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSearching ? (
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        )}
      </button>
    </form>
  );
} 