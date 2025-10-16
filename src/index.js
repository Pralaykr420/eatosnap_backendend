import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';

import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { testEmailConnection } from './services/emailService.js';

import authRoutes from './routes/authRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reelRoutes from './routes/reelRoutes.js';
import riderRoutes from './routes/riderRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', credentials: true },
});

connectDB();

testEmailConnection().then(success => {
  if (success) {
    logger.info('✅ Email service ready');
  } else {
    logger.error('❌ Email service failed - check credentials');
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use('/api', limiter);

app.get('/', (req, res) => {
  res.json({ message: 'EATOSNAP API is running', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

io.on('connection', socket => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-order', orderId => {
    socket.join(`order-${orderId}`);
  });

  socket.on('order-update', data => {
    io.to(`order-${data.orderId}`).emit('order-status-changed', data);
  });

  socket.on('rider-location-update', data => {
    io.to(`order-${data.orderId}`).emit('rider-location-changed', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
