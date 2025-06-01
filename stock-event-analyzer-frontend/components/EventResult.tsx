import React, { useState } from "react";

interface RelatedEvent {
  event: string;
  date: string;
  note: string;
  comparison?: string;
  simplifiedExplanation?: string;
}

interface MarketAnalysis {
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
  simplifiedExplanation?: string;
}

interface EconomicIndicators {
  gdpImpact: string;
  employmentImpact: string;
  interestRates: string;
  inflation: string;
  simplifiedExplanation?: string;
}

interface EventData {
  event: string;
  date: string;
  influencers: string[];
  description: string;
  reason: string;
  impact: string;
  whyThisMatters?: string;
  marketAnalysis?: MarketAnalysis;
  economicIndicators?: EconomicIndicators;
  investorLessons?: string;
  simplifiedExplanation?: string;
  glossary?: { [key: string]: string };
  relatedEvents?: RelatedEvent[];
  source: string;
  error?: string;
}

interface EventResultProps {
  data: EventData | null;
  isLoading: boolean;
}

export default function EventResult({ data, isLoading }: EventResultProps) {
  const [showSimplifiedMode, setShowSimplifiedMode] = useState(false);
  
  if (isLoading) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 flex items-center justify-center max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-blue-200">Analyzing market events...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (data.error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30 max-w-7xl mx-auto">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold text-red-300 mb-2">Analysis Error</h3>
          <p className="text-red-200">{data.error}</p>
        </div>
      </div>
    );
  }

  const glossaryTerms = data.glossary ? Object.entries(data.glossary) : [];
  const hasGlossary = glossaryTerms.length > 0;

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden max-w-7xl mx-auto">
      <div className="px-10 py-5 border-b border-white/10">
        <div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 mb-3">
            {data.event}
          </h2>
          <p className="text-2xl text-blue-200 font-medium">{data.date}</p>
        </div>
      </div>

      <div className="p-10 space-y-10">
        <div>
          <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Description
          </h3>
          <p className="text-white/80 leading-relaxed text-lg">{data.description}</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-indigo-300 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Key Figures
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.influencers.map((person, index) => (
              <span 
                key={index}
                className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 px-4 py-2 rounded-lg text-lg font-medium"
              >
                {person}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Market Impact
          </h3>
          <p className="text-white/80 leading-relaxed text-lg">{data.impact}</p>
        </div>
        
        {data.whyThisMatters && (
          <div>
            <h3 className="text-2xl font-bold text-green-300 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Why This Matters
            </h3>
            <p className="text-white/80 leading-relaxed text-lg">{data.whyThisMatters}</p>
          </div>
        )}
         
        {data.investorLessons && (
          <div>
            <h3 className="text-2xl font-bold text-emerald-300 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Investor Lessons
            </h3>
            <p className="text-white/80 leading-relaxed text-lg">{data.investorLessons}</p>
          </div>
        )}
      </div>
        
      {data.relatedEvents && data.relatedEvents.length > 0 && (
        <div className="px-10 pb-10 pt-0">
          <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Related Past Events
          </h3>
          <div className="space-y-5">
            {data.relatedEvents.map((event, index) => (
              <div key={index} className="pb-5 border-b border-white/10">
                <div className="font-medium text-yellow-200 text-xl mb-2">{event.event} <span className="text-yellow-400 text-lg">({event.date})</span></div>
                <p className="text-white/70 text-lg mt-2">{event.note}</p>
                {event.comparison && (
                  <p className="text-white/70 text-lg mt-3 italic pl-3">
                    <span className="text-yellow-400 font-medium">Comparison:</span> {event.comparison}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
        
      {data.marketAnalysis && (
        <div className="px-10 pb-10 pt-2">
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 mb-5">
              Detailed Market Analysis
            </h2>
            
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-xl">
                <h3 className="text-xl font-bold text-blue-300 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Short-term Impact
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">{data.marketAnalysis.shortTerm}</p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-xl">
                <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4" />
                  </svg>
                  Medium-term Trends
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">{data.marketAnalysis.mediumTerm}</p>
              </div>
              
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-5 rounded-xl">
                <h3 className="text-xl font-bold text-indigo-300 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Long-term Legacy
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">{data.marketAnalysis.longTerm}</p>
              </div>
            </div>
          </div>
        </div>
      )}
            
      {data.economicIndicators && (
        <div className="px-10 pb-10">
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-emerald-400 mb-5">
              Economic Impact
            </h2>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-green-500/10 border border-green-500/30 p-5 rounded-xl">
                <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  GDP Impact
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">{data.economicIndicators.gdpImpact}</p>
              </div>
              
              <div className="bg-teal-500/10 border border-teal-500/30 p-5 rounded-xl">
                <h3 className="text-xl font-bold text-teal-300 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Employment Impact
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">{data.economicIndicators.employmentImpact}</p>
              </div>
              
              <div className="bg-cyan-500/10 border border-cyan-500/30 p-5 rounded-xl">
                <h3 className="text-xl font-bold text-cyan-300 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Interest Rates
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">{data.economicIndicators.interestRates}</p>
              </div>
              
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-xl">
                <h3 className="text-xl font-bold text-emerald-300 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Inflation Impact
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">{data.economicIndicators.inflation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasGlossary && (
        <div className="px-10 pb-10">
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 mb-5 flex items-center">
              <svg className="w-7 h-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Financial Terms Glossary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {glossaryTerms.map(([term, definition], index) => (
                <div key={index} className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                  <div className="font-medium text-amber-300 mb-2 text-xl">{term}</div>
                  <p className="text-white/70 text-lg">{definition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-10 py-5 border-t border-white/10 bg-white/5">
        <p className="text-base text-blue-200/60">
          <span className="font-semibold">Source:</span> {data.source}
        </p>
      </div>
    </div>
  );
} 