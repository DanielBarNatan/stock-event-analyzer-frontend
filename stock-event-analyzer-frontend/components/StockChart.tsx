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
  onFetchData: (startDate: string) => void;
  stockData: StockData | null;
  isLoading: boolean;
  symbol: string;
  eventDate?: string; // Date from OpenAI response
}

type TimePeriod = 'oneWeek' | 'oneMonth' | 'threeMonths' | 'sixMonths';

export default function StockChart({ onFetchData, stockData, isLoading, symbol, eventDate }: StockChartProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('oneMonth');

  // Auto-fetch data when eventDate is provided
  useEffect(() => {
    if (eventDate) {
      setSelectedDate(eventDate);
      onFetchData(eventDate);
    }
  }, [eventDate, onFetchData]);

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      onFetchData(selectedDate);
    }
  };

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
    if (!stockData) return [];
    return stockData[activePeriod] || [];
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
      case 'oneMonth': return ['#EC4899', '#BE185D']; // Pink
      case 'threeMonths': return ['#F59E0B', '#D97706']; // Yellow
      case 'sixMonths': return ['#10B981', '#047857']; // Green
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white/95 dark:bg-gray-900/90 rounded-3xl shadow-2xl px-8 py-12 border-2 border-blue-200 dark:border-fuchsia-800 space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-fuchsia-600 to-yellow-500 dark:from-blue-300 dark:via-fuchsia-400 dark:to-yellow-300 mb-2">
          📈 S&P 500 Historical Data
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {eventDate ? "Showing impact from the historical event date" : "Track market performance over time"}
        </p>
      </div>

      {/* Date Input Form */}
      <form onSubmit={handleDateSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            📅 {eventDate ? "Event Date:" : "Select Start Date:"}
          </label>
          <input
            type="date"
            id="startDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 text-lg border-2 border-fuchsia-300 dark:border-fuchsia-700 rounded-xl focus:ring-4 focus:ring-fuchsia-400/40 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
            disabled={!!eventDate}
          />
        </div>
        {!eventDate && (
          <button
            type="submit"
            disabled={isLoading || !selectedDate}
            className="px-8 py-3 mt-6 bg-gradient-to-r from-blue-500 via-fuchsia-500 to-yellow-400 hover:from-blue-600 hover:via-fuchsia-600 hover:to-yellow-500 text-white text-lg font-bold rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Fetching..." : "Get Stock Data"}
          </button>
        )}
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin mr-4"></div>
          <span className="text-xl text-gray-700 dark:text-gray-200">Fetching S&P 500 data...</span>
        </div>
      )}

      {/* Chart Display */}
      {stockData && !isLoading && (
        <div className="space-y-6">
          
          {/* Time Period Tabs */}
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-2 flex flex-wrap gap-2 justify-center">
              {(['oneWeek', 'oneMonth', 'threeMonths', 'sixMonths'] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                    activePeriod === period
                      ? 'bg-gradient-to-r from-blue-500 via-fuchsia-500 to-yellow-400 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {getPeriodLabel(period)}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-96 w-full">
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
                    backgroundColor: '#1F2937',
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl text-center">
                <div className="text-2xl font-bold">${getCurrentData()[0]?.close.toFixed(2)}</div>
                <div className="text-sm opacity-90">Starting Price</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center">
                <div className="text-2xl font-bold">${getCurrentData()[getCurrentData().length - 1]?.close.toFixed(2)}</div>
                <div className="text-sm opacity-90">Ending Price</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl text-center">
                <div className="text-2xl font-bold">{getCurrentData().length}</div>
                <div className="text-sm opacity-90">Trading Days</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl text-center">
                <div className="text-2xl font-bold">
                  {((getCurrentData()[getCurrentData().length - 1]?.close - getCurrentData()[0]?.close) / getCurrentData()[0]?.close * 100).toFixed(1)}%
                </div>
                <div className="text-sm opacity-90">Total Change</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 