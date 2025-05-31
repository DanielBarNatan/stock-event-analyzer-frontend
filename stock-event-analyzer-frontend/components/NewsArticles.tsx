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
    <div className="w-full h-[400px] bg-black/30 rounded-lg flex items-center justify-center">
      <svg className="w-12 h-12 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-3/4 mb-6"></div>
            <div className="h-[400px] bg-white/5 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-6 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
              <div className="h-4 bg-white/10 rounded w-4/6"></div>
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
    <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Economic Impact Analysis
        </h2>
      </div>
      
      <div className="p-6">
        {/* Article Image - Full Width */}
        <div className="w-full h-[400px] relative rounded-lg overflow-hidden bg-black/20 mb-6">
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
          <h3 className="text-2xl font-semibold text-white">
            <a href={article.url} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="hover:text-blue-300 transition-colors">
              {article.title}
            </a>
          </h3>
          <p className="text-lg text-white/80">{article.description}</p>
          <div className="flex items-center justify-between text-sm text-blue-200/60 pt-4 border-t border-white/10">
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
            className="inline-block w-full text-center mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Read Full Analysis
            <svg className="inline-block w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsArticles; 