import React from "react";

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

interface EventResultProps {
  data: EventData | null;
  isLoading: boolean;
}

export default function EventResult({ data, isLoading }: EventResultProps) {
  if (isLoading) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 flex items-center justify-center">
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
      <div className="bg-red-900/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
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

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 mb-2">
          {data.event}
        </h2>
        <p className="text-lg text-blue-200 font-medium">{data.date}</p>
      </div>

      {/* Main Content */}
      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-blue-300 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </h3>
            <p className="text-white/80 leading-relaxed">{data.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-purple-300 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Relevance
            </h3>
            <p className="text-white/80 leading-relaxed">{data.reason}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-indigo-300 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Key Figures
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.influencers.map((person, index) => (
                <span 
                  key={index}
                  className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-300 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Market Impact
            </h3>
            <p className="text-white/80 leading-relaxed">{data.impact}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 bg-white/5">
        <p className="text-sm text-blue-200/60">
          <span className="font-semibold">Source:</span> {data.source}
        </p>
      </div>
    </div>
  );
} 