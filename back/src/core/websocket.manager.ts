// File: back/src/core/websocket.manager.ts
// Last change: Updated to adhere to project conventions and remove redundant logic

import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import { AccessRole } from 'common/types/access-role.types';
import { PROJECT_CONFIG } from 'common/configs/project.config';

interface SocketAuthPayload {
  id: string;
  role: string;
}

interface ServerToClientEvents {
  'vehicle:position': (payload: { vehicle_id: string; x: number; y: number }) => void;
  'task:status': (payload: { task_id: string; vehicle_id: string; status: string }) => void;
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
        origin: PROJECT_CONFIG.routing.homepage.default_org,
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
        socket.data.user_id = decoded.id;
        socket.data.role = decoded.role as AccessRole;
        next();
      } catch {
        next(new Error('Authentication error: Invalid token.'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`✅ [WS] Client connected: ${socket.id}, UserID: ${socket.data.user_id}`);

      if (socket.data.role === AccessRole.SUPERADMIN || socket.data.role === AccessRole.MANAGER) {
        socket.join('managers');
        console.log(`[WS] User ${socket.data.user_id} joined room: managers`);
      }

      socket.join(socket.data.user_id);

      socket.on('disconnect', () => {
        console.log(`[WS] Client disconnected: ${socket.id}`);
      });
    });

    console.log('🚀 [WS] WebSocket server initialized with Socket.IO');
  }

  public static emit_to_managers<T extends keyof ServerToClientEvents>(
    event: T,
    ...payload: Parameters<ServerToClientEvents[T]>
  ) {
    this.io.to('managers').emit(event, ...payload);
  }

  public static emit_to_user<T extends keyof ServerToClientEvents>(
    user_id: string,
    event: T,
    ...payload: Parameters<ServerToClientEvents[T]>
  ) {
    this.io.to(user_id).emit(event, ...payload);
  }

  public static broadcast<T extends keyof ServerToClientEvents>(
    event: T,
    ...payload: Parameters<ServerToClientEvents[T]>
  ) {
    this.io.emit(event, ...payload);
  }
}