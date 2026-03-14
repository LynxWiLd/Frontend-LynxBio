import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PublicPage from './pages/PublicPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTAS CON NAVBAR Y FOOTER */}
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Podés agregar más rutas aquí como /settings o /analytics */}
        </Route>

        {/* RUTAS SIN NAVBAR (Páginas limpias) */}
        <Route path="/login" element={<Login />} />
        <Route path="/:username" element={<PublicPage />} />
      </Routes>
    </Router>
  );
}

export default App;