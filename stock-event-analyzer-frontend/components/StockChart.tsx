"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface StockDataPoint {
  date: string;
  close: number;
}

interface StockData {
  oneWeek: StockDataPoint[];
  oneMonth: StockDataPoint[];
  threeMonths: StockDataPoint[];
  sixMonths: StockDataPoint[];
}

interface StockChartProps {
  data: StockData | null;
  eventDate?: string; // Date from the event
}

type TimePeriod = 'oneWeek' | 'oneMonth' | 'threeMonths' | 'sixMonths';

export default function StockChart({ data, eventDate }: StockChartProps) {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('oneMonth');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTooltipValue = (value: number) => {
    return [`$${value.toFixed(2)}`, 'Close Price'];
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCurrentData = () => {
    if (!data) return [];
    return data[activePeriod] || [];
  };

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'oneWeek': return '1 Week';
      case 'oneMonth': return '1 Month';
      case 'threeMonths': return '3 Months';
      case 'sixMonths': return '6 Months';
    }
  };

  const getGradientColor = (period: TimePeriod) => {
    switch (period) {
      case 'oneWeek': return ['#3B82F6', '#1D4ED8']; // Blue
      case 'oneMonth': return ['#8B5CF6', '#6D28D9']; // Purple
      case 'threeMonths': return ['#6366F1', '#4F46E5']; // Indigo
      case 'sixMonths': return ['#10B981', '#047857']; // Green
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400">
          S&P 500 Historical Data
        </h2>
        <p className="text-lg text-blue-200">
          {eventDate ? "Showing impact from the historical event date" : "Track market performance over time"}
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Event Date Display */}
        {eventDate && (
          <div className="flex items-center bg-black/20 p-4 rounded-xl">
            <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div className="text-sm text-blue-200">Event Date:</div>
              <div className="text-lg font-medium text-white">{eventDate}</div>
            </div>
          </div>
        )}

        {/* Chart Display */}
        {data ? (
          <div className="space-y-6">
            
            {/* Time Period Tabs */}
            <div className="flex justify-center">
              <div className="bg-black/20 rounded-xl p-1 flex flex-wrap gap-1 justify-center">
                {(['oneWeek', 'oneMonth', 'threeMonths', 'sixMonths'] as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setActivePeriod(period)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                      activePeriod === period
                        ? 'bg-white/10 text-white'
                        : 'text-blue-200/70 hover:text-blue-200 hover:bg-white/5'
                    }`}
                  >
                    {getPeriodLabel(period)}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-96 w-full bg-black/20 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getCurrentData()}>
                  <defs>
                    <linearGradient id={`colorGradient-${activePeriod}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getGradientColor(activePeriod)[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={getGradientColor(activePeriod)[1]} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value: any) => `$${value.toFixed(0)}`}
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    labelFormatter={formatTooltipLabel}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={getGradientColor(activePeriod)[0]}
                    strokeWidth={3}
                    fill={`url(#colorGradient-${activePeriod})`}
                    dot={{ fill: getGradientColor(activePeriod)[0], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: getGradientColor(activePeriod)[0], strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            {getCurrentData().length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">${getCurrentData()[0]?.close.toFixed(2)}</div>
                  <div className="text-sm text-blue-200">Starting Price</div>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">${getCurrentData()[getCurrentData().length - 1]?.close.toFixed(2)}</div>
                  <div className="text-sm text-purple-200">Ending Price</div>
                </div>
                <div className="bg-indigo-500/20 border border-indigo-500/30 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">{getCurrentData().length}</div>
                  <div className="text-sm text-indigo-200">Trading Days</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">
                    {((getCurrentData()[getCurrentData().length - 1]?.close - getCurrentData()[0]?.close) / getCurrentData()[0]?.close * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-200">Total Change</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-16 h-16 text-blue-400/30 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <h3 className="text-2xl font-bold text-blue-300 mb-2">No Stock Data Available</h3>
            <p className="text-blue-200/70 max-w-md">No market data is available for this event. Try searching for a different historical event.</p>
          </div>
        )}
      </div>
    </div>
  );
} 