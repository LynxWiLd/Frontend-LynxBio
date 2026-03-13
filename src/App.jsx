// Actualiza tu App.jsx
import { useState, useContext } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { AuthContext } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import Dashboard from './pages/Dashboard'; // Importamos el nuevo Dashboard

function App() {
  const [showLogin, setShowLogin] = useState(false);
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
              <Button variant="outline-light" size="sm" onClick={() => setShowLogin(true)}>
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      {user ? (
        <Dashboard /> // Si está logueado, mostramos el dashboard
      ) : (
        <Container className="mt-5 text-center py-5">
          <h1 className="display-4 fw-bold">Tu bio, un solo enlace.</h1>
          <p className="lead text-muted">Organiza tus redes sociales y contenido en una página simple y económica.</p>
          <Button variant="primary" size="lg" onClick={() => setShowLogin(true)}>
            Comenzar Gratis
          </Button>
        </Container>
      )}

      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
    </>
  );
}

export default App;