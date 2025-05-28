import React, { useEffect, useState } from "react";
import NewsArticles from "./NewsArticles";

interface EventData {
  event: string;
  date: string;
  influencers: string[];
  description: string;
  reason: string;
  impact: string;
  source: string;
  error?: string;
}

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string;
}

interface EventResultProps {
  data: EventData | null;
  isLoading: boolean;
}

export default function EventResult({ data, isLoading }: EventResultProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      if (data && !data.error) {
        setIsLoadingNews(true);
        try {
          const response = await fetch(`http://localhost:4000/api/news-articles?query=${encodeURIComponent(data.event)}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const newsData = await response.json();
          if (newsData.article) {
            setArticle(newsData.article);
          } else {
            setArticle(null);
          }
        } catch (error) {
          console.error('Failed to fetch news article:', error);
          setArticle(null);
        } finally {
          setIsLoadingNews(false);
        }
      } else {
        setArticle(null);
      }
    };

    fetchNews();
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl bg-white/95 dark:bg-gray-900/90 rounded-3xl shadow-2xl px-8 py-12 border-2 border-blue-200 dark:border-fuchsia-800">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-8 h-8 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xl text-gray-700 dark:text-gray-200">Searching historical events...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (data.error) {
    return (
      <div className="w-full max-w-4xl bg-red-50 dark:bg-red-900/30 rounded-3xl shadow-2xl px-8 py-12 border-2 border-red-200 dark:border-red-800">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">Error</h3>
          <p className="text-red-700 dark:text-red-300">{data.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="w-full max-w-4xl bg-white/95 dark:bg-gray-900/90 rounded-3xl shadow-2xl px-8 py-12 border-2 border-blue-200 dark:border-fuchsia-800 space-y-6">
        {/* Header */}
        <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-fuchsia-600 to-yellow-500 dark:from-blue-300 dark:via-fuchsia-400 dark:to-yellow-300 mb-2">
            {data.event}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-semibold">{data.date}</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-3">📋 Description</h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{data.description}</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">🎯 Relevance</h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{data.reason}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-3">👥 Key Figures</h3>
              <div className="flex flex-wrap gap-2">
                {data.influencers.map((person, index) => (
                  <span 
                    key={index}
                    className="bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">📈 Market Impact</h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{data.impact}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Source:</span> {data.source}
          </p>
        </div>
      </div>

      {/* News Article Section */}
      <NewsArticles article={article} isLoading={isLoadingNews} />
    </div>
  );
} 