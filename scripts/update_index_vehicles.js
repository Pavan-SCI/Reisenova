import fs from 'fs';
let content = fs.readFileSync('index.js', 'utf8');

if (!content.includes('vehicleRoutes')) {
  content = content.replace(
    "import settingsRoutes from './routes/settingsRoutes.js';",
    "import settingsRoutes from './routes/settingsRoutes.js';\nimport vehicleRoutes from './routes/vehicleRoutes.js';"
  );
  content = content.replace(
    "app.use('/api/settings', settingsRoutes);",
    "app.use('/api/settings', settingsRoutes);\n  app.use('/api/vehicles', vehicleRoutes);"
  );
  fs.writeFileSync('index.js', content);
}
