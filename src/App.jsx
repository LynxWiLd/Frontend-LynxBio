import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importamos esto
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { AuthContext } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Dashboard from './pages/Dashboard';
import PublicPage from './pages/PublicPage'; // ¡No te olvides de este!

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout } = useContext(AuthContext);

  // Componente interno para la Home (Landing o Dashboard)
  const Home = () => (
    <>
      {user ? (
        <Dashboard />
      ) : (
        <Container className="mt-5 text-center py-5">
          <h1 className="display-4 fw-bold">Tu bio, un solo enlace.</h1>
          <p className="lead text-muted">Organiza tus redes sociales y contenido en una página simple.</p>
          <Button variant="primary" size="lg" onClick={() => setShowRegister(true)}>
            Comenzar Gratis
          </Button>
        </Container>
      )}
    </>
  );

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">LynxBio</Navbar.Brand>
          <Nav className="ms-auto">
            {user ? (
              <>
                <span className="navbar-text me-3 d-none d-sm-inline">Hola, {user.username}</span>
                <Button variant="outline-danger" size="sm" onClick={logout}>Salir</Button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Button variant="link" className="text-white text-decoration-none" onClick={() => setShowLogin(true)}>
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => setShowRegister(true)}>
                  Registrarse
                </Button>
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        {/* Ruta principal: Muestra Landing o Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Ruta dinámica: Muestra la página de links de CUALQUIER usuario */}
        <Route path="/:username" element={<PublicPage />} />
      </Routes>

      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
      <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} />
    </Router>
  );
}

export default App;