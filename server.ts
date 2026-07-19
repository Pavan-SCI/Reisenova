import 'dotenv/config';
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from 'cors';

// Import backend routes
import tripRoutes from './backend/routes/tripRoutes.js';
import destinationRoutes from './backend/routes/destinationRoutes.js';
import hotelRoutes from './backend/routes/hotelRoutes.js';
import packageRoutes from './backend/routes/packageRoutes.js';
import bookingRoutes from './backend/routes/bookingRoutes.js';
import uploadRoutes from './backend/routes/uploadRoutes.js';
import settingsRoutes from './backend/routes/settingsRoutes.js';
import vehicleRoutes from './backend/routes/vehicleRoutes.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/trips', tripRoutes);
  app.use('/api/destinations', destinationRoutes);
  app.use('/api/hotels', hotelRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/vehicles', vehicleRoutes);
  
  // Serve uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'backend/uploads')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: 'frontend' 
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
