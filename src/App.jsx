import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/Home/HomePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import PublicPage from "./pages/PublicProfile/PublicPage";
import NotFound from "./pages/NotFound/NotFound";

// Components Globales
import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";
import { Spinner } from "react-bootstrap"; // O tu spinner de lince personalizado

function App() {
  const { user, loading } = useContext(AuthContext);

  /**
   * 🪄 HIGIENE VISUAL: Mientras el lince busca el rastro (validando token),
   * mostramos un estado de carga para evitar saltos bruscos en la UI.
   */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  }

  return (
    <Router>
      {/* 🟢 MODALES: Se abren/cierran mediante el AuthContext */}
      <LoginModal />
      <RegisterModal />

      <Routes>
        {/* 1. RUTAS CON LAYOUT GLOBAL (Navbar, Footer, etc.) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />

          {/* 🛡️ RUTA PROTEGIDA: Si no hay lince, lo mandamos a la Home 
              para que el Modal de Login se encargue. */}
          <Route
            path="dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" replace />}
          />
        </Route>

        {/* 2. RUTA DE PERFIL PÚBLICO (Limpia) */}
        <Route path="/:username" element={<PublicPage />} />

        {/* 3. EL LINCE PERDIDO (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
