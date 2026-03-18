import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/Home/HomePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import PublicPage from "./pages/PublicProfile/PublicPage";
/* 🪄 IMPORTANTE: Importamos la nueva página 404 profesional */
import NotFound from "./pages/NotFound/NotFound"; 

// Components Globales
import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";

function App() {
  return (
    <Router>
      {/* 🟢 MODALES: Persistentes en toda la app para login/registro rápido */}
      <LoginModal />
      <RegisterModal />

      <Routes>
        {/* 1. RUTA PRIVADA / LANDING
            Hereda Navbar, Footer y ThemeToggle desde MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* 2. RUTA DE PERFIL PÚBLICO
            Diseño limpio y personalizado por el usuario. Sin Navbar global. */}
        <Route path="/:username" element={<PublicPage />} />

        {/* 3. RUTA 404 (EL LINCE PERDIDO)
            Captura cualquier rastro que no exista en el bosque digital. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;