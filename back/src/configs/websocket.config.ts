// File: back/src/configs/websocket.config.ts
// Last change: Replaced 'ws' with 'socket.io' for rooms and typed events

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { WorkerRole } from '@prisma/client';
import jwt from 'jsonwebtoken';

interface SocketAuthPayload {
  id: string;
  role: WorkerRole;
}

interface ServerToClientEvents {
  'vehicle:position': (payload: { vehicleId: string; x: number; y: number }) => void;
  'task:status': (payload: { taskId: number; vehicleId: string; status: string }) => void;
  'alert:created': (payload: { message: string; level: 'info' | 'warning' | 'error' }) => void;
}

interface ClientToServerEvents {
  'join:room': (room: string) => void;
}

export class WebSocketManager {
  private static io: Server<ClientToServerEvents, ServerToClientEvents>;

  public static initialize(server: HttpServer): void {
    this.io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
      path: '/ws/',
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token as string;
      if (!token) {
        return next(new Error('Authentication error: Token not provided.'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SocketAuthPayload;
        socket.data.userId = decoded.id;
        socket.data.role = decoded.role;
        next();
      } catch (err) {
        next(new Error('Authentication error: Invalid token.'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`✅ [WS] Client connected: ${socket.id}, UserID: ${socket.data.userId}`);

      // Automatically join rooms based on role
      if (socket.data.role === WorkerRole.ADMIN || socket.data.role === WorkerRole.MANAGER) {
        socket.join('managers');
        console.log(`[WS] User ${socket.data.userId} joined room: managers`);
      }
      socket.join(socket.data.userId); // Personal room for direct messages

      socket.on('disconnect', () => {
        console.log(`[WS] Client disconnected: ${socket.id}`);
      });
    });

    console.log('🚀 [WS] WebSocket server initialized with Socket.IO');
  }

  public static emitToManagers<T extends keyof ServerToClientEvents>(event: T, ...payload: Parameters<ServerToClientEvents[T]>) {
    this.io.to('managers').emit(event, ...payload);
  }

  public static emitToUser<T extends keyof ServerToClientEvents>(userId: string, event: T, ...payload: Parameters<ServerToClientEvents[T]>) {
    this.io.to(userId).emit(event, ...payload);
  }

  public static broadcast<T extends keyof ServerToClientEvents>(event: T, ...payload: Parameters<ServerToClientEvents[T]>) {
    this.io.emit(event, ...payload);
  }
}
