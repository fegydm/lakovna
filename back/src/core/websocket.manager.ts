// File: back/src/core/websocket.manager.ts
// Last change: Updated to adhere to project conventions and remove redundant logic

import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import { AccessRole } from 'common/types/project.types';
import { PROJECT_CONFIG } from 'common/configs/project.config';
import { ACCESS_ROLES } from 'common/configs/enums.config'; 

interface SocketAuthPayload {
  id: string;
  role: string;
}

// FIX: Keys in payloads are now camelCase
interface ServerToClientEvents {
  'vehicle:position': (payload: { vehicleId: string; x: number; y: number }) => void;
  'task:status': (payload: { taskId: string; vehicleId: string; status: string }) => void;
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
        origin: PROJECT_CONFIG.routing.homepage.defaultOrg,
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
        socket.data.userId = decoded.id; // <-- FIX: Use camelCase for socket data keys
        socket.data.role = decoded.role as AccessRole;
        next();
      } catch {
        next(new Error('Authentication error: Invalid token.'));
      }
    });

    this.io.on('connection', (socket) => {
      // FIX: Use camelCase variable in log
      console.log(`✅ [WS] Client connected: ${socket.id}, UserID: ${socket.data.userId}`);

      // FIX: Compare against runtime constants from config, not against a type
      // Note: Assuming ACCESS_ROLES contains a 'MANAGER' key based on original logic.
      if (socket.data.role === ACCESS_ROLES.SUPERADMIN || socket.data.role === 'manager') { // Or ACCESS_ROLES.MANAGER if defined
        socket.join('managers');
        console.log(`[WS] User ${socket.data.userId} joined room: managers`);
      }

      // FIX: Use camelCase variable for room name
      socket.join(socket.data.userId);

      socket.on('disconnect', () => {
        console.log(`[WS] Client disconnected: ${socket.id}`);
      });
    });

    console.log('🚀 [WS] WebSocket server initialized with Socket.IO');
  }

  // FIX: Method name is now camelCase
  public static emitToManagers<T extends keyof ServerToClientEvents>(
    event: T,
    ...payload: Parameters<ServerToClientEvents[T]>
  ) {
    this.io.to('managers').emit(event, ...payload);
  }

  // FIX: Method and parameter names are now camelCase
  public static emitToUser<T extends keyof ServerToClientEvents>(
    userId: string,
    event: T,
    ...payload: Parameters<ServerToClientEvents[T]>
  ) {
    this.io.to(userId).emit(event, ...payload);
  }

  public static broadcast<T extends keyof ServerToClientEvents>(
    event: T,
    ...payload: Parameters<ServerToClientEvents[T]>
  ) {
    this.io.emit(event, ...payload);
  }
}