import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/Home/HomePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import PublicPage from "./pages/PublicProfile/PublicPage";

// Components Globales
import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle"; // 👈 Importamos el nuevo dueño de la luz

function App() {
  return (
    <Router>
      {/* ☀️ COMPONENTES GLOBALES 🌙 */}
      {/* Viven aquí para que floten sobre cualquier ruta sin reiniciarse */}
      <ThemeToggle /> 
      <LoginModal />
      <RegisterModal />

      <Routes>
        {/* 1. Ruta Pública y de Landing (Navbar y Footer mediante MainLayout) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* 2. Ruta de Perfil (Limpia, sin Navbar) */}
        <Route path="/:username" element={<PublicPage />} />

        {/* 3. Ruta 404 */}
        <Route
          path="*"
          element={
            <div className="text-center mt-5" style={{ color: 'var(--text-main)' }}>
              <h1>404 - Not Found</h1>
              <p>Parece que este lince se perdió en el bosque.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;