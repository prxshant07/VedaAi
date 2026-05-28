import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectMongoDB } from './utils/database';
import { connectRedis } from './utils/redis';
import { initSocketIO } from './websocket/socket';
import assignmentRoutes from './routes/assignment.routes';
import assessmentRoutes from './routes/assessment.routes';
import uploadRoutes from './routes/upload.routes';
import pdfRoutes from './routes/pdf.routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter, generationLimiter, uploadLimiter } from './middleware/rateLimiter';
import { sanitizeInputs } from './middleware/sanitize';

import './workers/assessmentWorker';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Security & middleware
app.use(helmet({ crossOriginEmbedderPolicy: false }));
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);
app.use(sanitizeInputs);
app.use('/api', apiLimiter);

// Routes
app.use('/api/assignments', apiLimiter, assignmentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handling
app.get('/', (_, res) => {
  res.json({
    message: 'VedaAI Backend Running',
    status: 'ok',
  });
});
app.use(errorHandler);

// Initialize Socket.IO
export const io = initSocketIO(httpServer);

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await connectMongoDB();
    await connectRedis();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 WebSocket ready`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
