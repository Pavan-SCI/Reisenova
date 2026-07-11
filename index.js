import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

import tripRoutes from './routes/tripRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/trips', tripRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Reisenova API is running smoothly.' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
