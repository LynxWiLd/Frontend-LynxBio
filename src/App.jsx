import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/Home/HomePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import PublicPage from "./pages/PublicProfile/PublicPage";

// Components (Modales Globales)
import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";

function App() {
  return (
    <Router>
      {/* 🟢 MODALES GLOBALES: Viven fuera de las rutas para estar siempre disponibles */}
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
            <div className="text-center mt-5">
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
