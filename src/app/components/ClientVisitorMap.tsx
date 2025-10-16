'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { io } from 'socket.io-client';

// Dynamically import the map component to avoid SSR issues
const VisitorMapWithNoSSR = dynamic(
  () => import('./VisitorMap'),
  { ssr: false }
);

// Visitor type definition
interface Visitor {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

export default function ClientVisitorMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Initialize the API route to start the socket server
    fetch('/api/socket')
      .then(res => res.json())
      .then(() => {
        console.log('Socket server initialized');
        setIsLoaded(true);
      })
      .catch(err => console.error('Failed to initialize socket server:', err));
      
    // Simulate visitor location for testing
    const simulateVisitor = () => {
      // This would be replaced with actual geolocation in a real scenario
      const socket = io('http://localhost:3001');
      
      // Send mock location
      socket.emit('visitor:location', {
        location: {
          lat: 40 + (Math.random() * 20 - 10),
          lng: 0 + (Math.random() * 40 - 20)
        }
      });
      
      return () => {
        socket.disconnect();
      };
    };
    
    // Start simulation
    const cleanup = simulateVisitor();
    
    return () => {
      cleanup();
    };
  }, []);
  
  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-500">Initializing map...</p>
      </div>
    );
  }
  
  return <VisitorMapWithNoSSR />;
}
