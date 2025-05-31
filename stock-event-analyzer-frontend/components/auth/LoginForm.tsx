'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Trigger entrance animation after component mounts
    setTimeout(() => setAnimate(true), 100);
  }, []);

  useEffect(() => {
    // Handle error animation
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate random animated dots for the background
  const renderBackgroundElements = () => {
    const elements = [];
    for (let i = 0; i < 20; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 10 + 5;
      const animationDuration = Math.random() * 20 + 10;
      
      elements.push(
        <div 
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 animate-pulse"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${animationDuration}s`,
          }}
        />
      );
    }
    return elements;
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative">
      {/* Animated background elements */}
      {renderBackgroundElements()}
      
      {/* Glassmorphism glowing circle */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      
      {/* 3D rotating lines */}
      <div className="absolute w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 bottom-0 animate-[spin_20s_linear_infinite]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              style={{ transform: `translate(-50%, -50%) rotate(${i * 18}deg)` }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ease-out transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Logo and app title */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-shift"></div>
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-black">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M7 7V12C7 13.1046 7.89543 14 9 14H10" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  className="animate-[dash_3s_ease-in-out_infinite]"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                />
                <path 
                  d="M14 12V7M14 7H17M14 7H11" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  className="animate-[dash_3s_ease-in-out_infinite_0.5s]"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                />
                <path 
                  d="M17 20V12M17 12L20 15M17 12L14 15" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="animate-[dash_3s_ease-in-out_infinite_1s]"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
              Intelligen<span className="text-white font-black">T</span>rader
            </span>
          </h1>
          <p className="text-blue-200 text-lg mb-2">Innovative Market Intelligence</p>
          <div className="flex justify-center space-x-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-ping [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-ping [animation-delay:0.4s]"></span>
          </div>
        </div>

        {/* Login form card with glassmorphism effect */}
        <div className={`bg-black/20 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 transition-all ${shake ? 'animate-shake' : ''}`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Username field with floating label */}
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  className="peer w-full h-12 px-4 pt-5 bg-black/20 text-white rounded-xl border border-white/10 outline-none transition-all focus:border-blue-500 placeholder-transparent"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label
                  htmlFor="username"
                  className="absolute left-4 top-4 text-sm text-blue-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-white/50 peer-focus:text-sm peer-focus:top-1.5 peer-focus:text-blue-300"
                >
                  Username
                </label>
                <div className="absolute right-4 top-3.5">
                  <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Password field with floating label */}
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="peer w-full h-12 px-4 pt-5 bg-black/20 text-white rounded-xl border border-white/10 outline-none transition-all focus:border-blue-500 placeholder-transparent"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-4 text-sm text-blue-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-white/50 peer-focus:text-sm peer-focus:top-1.5 peer-focus:text-blue-300"
                >
                  Password
                </label>
                <div className="absolute right-4 top-3.5">
                  <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sign in button with liquid animation effect */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full h-12 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-medium shadow-lg transition-all hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <span className="relative flex items-center justify-center">
                    Access Dashboard
                    <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-blue-200/60 text-sm">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="relative inline-block text-blue-400 hover:text-blue-300 transition-colors group"
                >
                  <span>Create one now</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
            </div>
          </form>
        </div>
        
        {/* Footer with floating effect */}
        <div className="mt-12 text-center animate-float">
          <div className="inline-flex items-center space-x-1 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-blue-200">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>Secured with end-to-end encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
} 