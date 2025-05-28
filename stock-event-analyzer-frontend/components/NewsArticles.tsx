import { useState } from 'react';
import Image from 'next/image';

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
}

interface NewsArticlesProps {
  article: Article | null;
  isLoading: boolean;
}

const NewsArticles: React.FC<NewsArticlesProps> = ({ article, isLoading }) => {
  const [imageError, setImageError] = useState(false);

  const FallbackImage = () => (
    <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
      <span className="text-gray-400">No image available</span>
    </div>
  );

  const containerClasses = "w-full max-w-4xl mx-auto bg-white/95 dark:bg-gray-900/90 rounded-lg shadow-2xl p-6 mb-6";

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-[400px] bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className={containerClasses}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Economic Impact Analysis
        </h2>
        
        {/* Article Image - Full Width */}
        <div className="w-full h-[400px] relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {article.urlToImage && !imageError ? (
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-contain"
              onError={() => setImageError(true)}
              unoptimized={true}
              loading="eager"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          ) : (
            <FallbackImage />
          )}
        </div>
        
        {/* Article Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            <a href={article.url} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="hover:text-blue-600 transition-colors">
              {article.title}
            </a>
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">{article.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="font-medium">{article.source}</span>
            <span>{new Date(article.publishedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full text-center mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Read Full Analysis →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsArticles; 