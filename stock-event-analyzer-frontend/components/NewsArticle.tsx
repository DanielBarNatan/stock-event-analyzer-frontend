import { useState } from 'react';
import Image from 'next/image';

interface Article {
  title: string;
  description: string;
  url: string;
  source: string | { name: string };
  publishedAt: string;
  urlToImage: string | null;
}

interface NewsArticleProps {
  article: Article;
  isHistorical: boolean; // keeping for backward compatibility
}

const NewsArticle: React.FC<NewsArticleProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);

  const FallbackImage = () => (
    <div className="w-full h-[300px] bg-black/30 rounded-lg flex items-center justify-center">
      <svg className="w-12 h-12 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );

  // Format the publish date
  const publishDate = new Date(article.publishedAt);
  const formattedDate = publishDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      <div className="p-6">
        {/* Article Image */}
        <div className="w-full h-[300px] relative rounded-lg overflow-hidden bg-black/20 mb-6">
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
            <span className="font-medium">
              {typeof article.source === 'object' ? article.source?.name : article.source}
            </span>
            <span>{formattedDate}</span>
          </div>
          
          {/* Information Badge */}
          <div className="bg-blue-500/10 text-blue-300 px-4 py-3 rounded-lg text-sm">
            <svg className="inline-block w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            This article provides analysis and context for this financial event.
          </div>
          
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full text-center mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Read Full Article
            <svg className="inline-block w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsArticle; 