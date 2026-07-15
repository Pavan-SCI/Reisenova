import fs from 'fs';
import path from 'path';

const planTripPath = path.join(process.cwd(), 'src/pages/PlanTripPage.tsx');
let content = fs.readFileSync(planTripPath, 'utf8');

if (!content.includes('useNavigate')) {
  content = content.replace("import { Link } from 'react-router-dom';", "import { Link, useNavigate } from 'react-router-dom';");
}

if (!content.includes('navigate(\'/login\')')) {
  content = content.replace(
    "const PlanTripPage = () => {",
    "const PlanTripPage = () => {\n  const navigate = useNavigate();\n  useEffect(() => {\n    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';\n    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';\n    if (!isUserLoggedIn && !isAdminLoggedIn) {\n      navigate('/login');\n    }\n  }, [navigate]);\n"
  );
}

fs.writeFileSync(planTripPath, content);
console.log("Updated PlanTripPage.tsx");
