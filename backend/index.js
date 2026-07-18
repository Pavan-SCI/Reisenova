import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import tripRoutes from './routes/tripRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import { db } from './config/firebase.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json()); // Parses incoming JSON requests

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Routes
  app.use('/api/trips', tripRoutes);
  app.use('/api/destinations', destinationRoutes);
  app.use('/api/hotels', hotelRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/vehicles', vehicleRoutes);

  // Health Check Route
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'Reisenova API is running smoothly.',
        db: db !== null,
        hasSa: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
        hasSaPath: !!process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    });
  });

  // Start Server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
