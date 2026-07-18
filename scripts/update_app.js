import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('VehiclesPage')) {
  content = content.replace(
    "import DestinationDetailsPage from './pages/DestinationDetailsPage';",
    "import DestinationDetailsPage from './pages/DestinationDetailsPage';\nimport VehiclesPage from './pages/VehiclesPage';\nimport VehicleDetailsPage from './pages/VehicleDetailsPage';"
  );
  content = content.replace(
    '<Route path="/admin/login" element={<LoginPage />} />',
    '<Route path="/admin/login" element={<LoginPage />} />\n          <Route path="/vehicles" element={<VehiclesPage />} />\n          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />'
  );
  fs.writeFileSync('src/App.tsx', content);
}
