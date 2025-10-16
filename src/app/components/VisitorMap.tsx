'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons in Next.js
const markerIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom grayscale style for the map
const grayscaleStyle = {
  filter: 'grayscale(100%)'
};

// Visitor type definition
interface Visitor {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
}

export default function VisitorMap() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [socket, setSocket] = useState<any>(null);
  
  // Default map center (can be adjusted)
  const defaultCenter = { lat: 40, lng: 0 };
  
  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io('http://localhost:3001');
    setSocket(socketInstance);
    
    // Listen for visitor updates
    socketInstance.on('admin:visitors', (data: Visitor[]) => {
      console.log('Received visitor data:', data);
      setVisitors(data);
    });
    
    // Mock visitor data for testing
    const mockVisitors = [
      {
        id: 'mock-1',
        location: { lat: 40.7128, lng: -74.0060 }, // New York
        timestamp: new Date().toISOString()
      },
      {
        id: 'mock-2',
        location: { lat: 51.5074, lng: -0.1278 }, // London
        timestamp: new Date().toISOString()
      },
      {
        id: 'mock-3',
        location: { lat: 48.8566, lng: 2.3522 }, // Paris
        timestamp: new Date().toISOString()
      }
    ];
    
    // Set mock data for initial testing
    setVisitors(mockVisitors);
    
    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);
  
  return (
    <div className="h-full w-full">
      <MapContainer 
        center={defaultCenter} 
        zoom={2} 
        style={{ height: '100%', width: '100%', ...grayscaleStyle }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {visitors.map((visitor) => (
          <Marker 
            key={visitor.id}
            position={visitor.location}
            icon={markerIcon}
          >
            <Popup>
              <div>
                <p className="font-bold">Visitor ID: {visitor.id.substring(0, 8)}...</p>
                <p>Connected at: {new Date(visitor.timestamp).toLocaleTimeString()}</p>
                <p>Location: {visitor.location.lat.toFixed(4)}, {visitor.location.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
