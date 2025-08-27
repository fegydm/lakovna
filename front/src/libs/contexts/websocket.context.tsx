// File: front/src/core/contexts/websocket.context.tsx
// Last change: Fixed a NodeJS type error for browser compatibility.

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useAuth } from '../../libs/contexts/auth.context';

interface WebSocketMessage {
  type: string;
  payload: any;
}

interface WebSocketContextType {
  lastMessage: WebSocketMessage | null;
  sendMessage: (type: string, payload: any) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const MAX_RETRY_INTERVAL = 30000;

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  const connect = useCallback(() => {
    const wsUrl = `${window.location.protocol === 'https' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Central WebSocket: Connected");
      retryCountRef.current = 0;
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data) as WebSocketMessage;
        setLastMessage(parsedData);
      } catch (error) {
        console.error("Central WebSocket: Failed to parse message", error);
      }
    };

    ws.onclose = () => {
      console.log("Central WebSocket: Disconnected. Attempting to reconnect...");
      setSocket(null);
      
      const retryInterval = Math.min(1000 * (2 ** retryCountRef.current), MAX_RETRY_INTERVAL);
      retryCountRef.current++;

      retryTimeoutRef.current = setTimeout(() => {
        if (isAuthenticated) {
          connect();
        }
      }, retryInterval);
    };

    ws.onerror = (error) => {
      console.error("Central WebSocket Error:", error);
      ws.close();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
  }, [isAuthenticated, connect, socket]);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = { type, payload };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  const value = {
    lastMessage,
    sendMessage,
    isConnected: socket?.readyState === WebSocket.OPEN,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
};
