import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import apiRouter from './routes/api.js';
import { registerSocketHandlers } from './events/socketHandlers.js';
import { getDb } from './db/schema.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use('/api', apiRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Initialize DB
getDb();

// Register socket handlers
registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`[Server] Trivia Game server running on http://localhost:${PORT}`);
});

export { app, httpServer, io };
