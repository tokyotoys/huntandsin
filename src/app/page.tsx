'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('thehunter');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded authentication for single user
    if (username === 'thehunter' && password === 'Cetemiri?') {
      // In a real app, we would set a secure cookie or token here
      localStorage.setItem('auth', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* Dark forest background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/dark_forest_login_bg.png"
          alt="Dark Forest Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      {/* Login container */}
      <div className="z-10 bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-2xl w-80">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-200">Shadow Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Restricted Access</p>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              readOnly
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
