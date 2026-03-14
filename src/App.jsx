import { useState, useContext } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { AuthContext } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal'; // Nuevo
import Dashboard from './pages/Dashboard';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // Nuevo estado
  const { user, logout } = useContext(AuthContext);

  return (
    <>
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

      {/* Modales */}
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
      <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} />
    </>
  );
}

export default App;