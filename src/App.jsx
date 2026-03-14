import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/Home/HomePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import PublicPage from "./pages/PublicProfile/PublicPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Ruta Pública y de Landing (Usa el Layout para tener Navbar y Footer) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* 2. Ruta de Perfil (Limpia, sin el Navbar del sistema) */}
        <Route path="/:username" element={<PublicPage />} />

        {/* 3. Ruta 404 o por defecto (Opcional) */}
        <Route
          path="*"
          element={
            <div className="text-center mt-5">
              <h1>404 - Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
