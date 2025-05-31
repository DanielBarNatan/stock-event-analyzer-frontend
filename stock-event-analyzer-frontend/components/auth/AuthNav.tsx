'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function AuthNav() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-10 w-40">
        <div className="w-5 h-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center px-5 py-2.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-blue-200 mr-4">
            Welcome, <span className="font-medium text-white">{user.username}</span>
          </span>
          <div className="h-6 w-px bg-white/10 mr-4"></div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 px-5 py-2.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
      <Link
        href="/login"
        className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span>Login</span>
      </Link>
      <Link
        href="/register"
        className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <span>Register</span>
      </Link>
    </div>
  );
} 