'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import the ClientVisitorMap component
const ClientVisitorMap = dynamic(
  () => import('../components/ClientVisitorMap'),
  { ssr: false, loading: () => <p className="text-gray-500">Loading map...</p> }
);

export default function Dashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user is authenticated
    const isAuth = localStorage.getItem('auth') === 'true';
    if (!isAuth) {
      router.push('/');
    }
  }, [router]);

  if (!isClient) {
    return null; // Prevent hydration errors
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Left sidebar menu */}
      <div className="w-64 bg-black/50 border-r border-gray-800 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-100">Shadow Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Logged in as thehunter</p>
        </div>
        
        <nav className="space-y-1">
          <a href="#" className="flex items-center px-4 py-3 text-gray-300 bg-gray-800/50 rounded-md">
            <span className="mr-3">🗺️</span>
            <span>Live Visitor Map</span>
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800/30 rounded-md">
            <span className="mr-3">📊</span>
            <span>Analytics</span>
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800/30 rounded-md">
            <span className="mr-3">⚙️</span>
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800/30 rounded-md">
            <span className="mr-3">📁</span>
            <span>Files</span>
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800/30 rounded-md">
            <span className="mr-3">👤</span>
            <span>Profile</span>
          </a>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={() => {
              localStorage.removeItem('auth');
              router.push('/');
            }}
            className="w-full flex justify-center items-center px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-200 rounded-md text-sm"
          >
            <span className="mr-2">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content area with map */}
      <div className="flex-1 flex flex-col">
        <header className="bg-black/30 border-b border-gray-800 p-4">
          <h2 className="text-lg font-medium">Live Visitor Map</h2>
          <p className="text-sm text-gray-400">Real-time tracking of website visitors</p>
        </header>
        
        <main className="flex-1 p-4 overflow-auto">
          <div className="bg-black/20 border border-gray-800 rounded-lg h-full relative">
            {/* Real-time visitor map component */}
            <div id="visitor-map" className="h-full w-full">
              {isClient && <ClientVisitorMap />}
            </div>
          </div>
        </main>
        
        <footer className="bg-black/30 border-t border-gray-800 p-2 text-center text-xs text-gray-500">
          Shadow Admin Dashboard • Single User Mode • {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
