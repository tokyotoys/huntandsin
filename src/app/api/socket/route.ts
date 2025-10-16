import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

// Store for active visitors
const activeVisitors = new Map();

// Socket.io server instance
let io;

export async function GET(req) {
  if (!io) {
    // Create new Socket.io server if it doesn't exist
    const { createServer } = await import('http');
    const { Server: IOServer } = await import('socket.io');
    
    const httpServer = createServer();
    io = new IOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('New client connected', socket.id);
      
      // Handle visitor location update
      socket.on('visitor:location', (data) => {
        const visitorData = {
          id: socket.id,
          location: data.location,
          timestamp: new Date().toISOString()
        };
        
        // Store visitor data
        activeVisitors.set(socket.id, visitorData);
        
        // Broadcast to all admin clients
        io.emit('admin:visitors', Array.from(activeVisitors.values()));
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        activeVisitors.delete(socket.id);
        io.emit('admin:visitors', Array.from(activeVisitors.values()));
      });
    });

    // Start server on a different port
    httpServer.listen(3001, () => {
      console.log('Socket.io server running on port 3001');
    });
  }

  return NextResponse.json({ status: 'Socket server running' });
}
