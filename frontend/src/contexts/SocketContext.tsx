import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const createSocketConnection = async () => {
      try {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connection', () => {
          // console.log('Connected to Socket.IO server');
        });

        return () => {
          // console.log('Disconnected from Socket.IO server');
          newSocket.disconnect();
        }; // Cleanup function for proper disconnection on unmount
      } catch (error) {
        console.error('Error creating socket connection:', error);
      }
    };

    createSocketConnection();
  }, []); // Run effect only once on component mount

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};