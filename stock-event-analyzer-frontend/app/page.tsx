"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import StockAnalyzer from '../components/StockAnalyzer';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show StockAnalyzer on the root path
  if (user && pathname === '/') {
    return <StockAnalyzer />;
  }

  // Return null while redirecting
  return null;
}

