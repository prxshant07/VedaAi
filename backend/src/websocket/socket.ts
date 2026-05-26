import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export function initSocketIO(httpServer: HttpServer): Server {
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Socket CORS blocked origin: ${origin}`));
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room for specific assignment
    socket.on('join-assignment', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      console.log(`📥 Socket ${socket.id} joined room: assignment:${assignmentId}`);
      socket.emit('joined', { assignmentId, message: 'Subscribed to assignment updates' });
    });

    socket.on('leave-assignment', (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
      console.log(`📤 Socket ${socket.id} left room: assignment:${assignmentId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
    });

    socket.on('error', (err) => {
      console.error(`Socket error for ${socket.id}:`, err);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export type GenerationEvent =
  | 'generation-started'
  | 'generation-progress'
  | 'generation-complete'
  | 'generation-failed';

export function emitToAssignment(
  assignmentId: string,
  event: GenerationEvent,
  data: Record<string, unknown>
): void {
  if (!io) return;
  io.to(`assignment:${assignmentId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
}
