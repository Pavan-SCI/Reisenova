import fs from 'fs';

let content = fs.readFileSync('index.js', 'utf8');

if (!content.includes("import uploadRoutes from './routes/uploadRoutes.js';")) {
  content = content.replace(
    "import bookingRoutes from './routes/bookingRoutes.js';",
    "import bookingRoutes from './routes/bookingRoutes.js';\nimport uploadRoutes from './routes/uploadRoutes.js';"
  );
}

if (!content.includes("app.use('/api/upload', uploadRoutes);")) {
  content = content.replace(
    "app.use('/api/bookings', bookingRoutes);",
    "app.use('/api/bookings', bookingRoutes);\n  app.use('/api/upload', uploadRoutes);"
  );
}

fs.writeFileSync('index.js', content);
