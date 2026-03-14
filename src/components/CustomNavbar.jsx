import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const CustomNavbar = () => {
  const { user, handleOpenLogin, handleOpenRegister } = useContext(AuthContext);

  return (
    <>
      <Navbar bg="white" expand="lg" className="py-3 shadow-sm sticky-top">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-3 text-primary">lynxbio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-2">
              {!user ? (
                <>
                  <Button variant="link" className="text-decoration-none text-dark fw-semibold" onClick={handleOpenLogin}>
                    Iniciá sesión
                  </Button>
                  <Button variant="primary" className="rounded-pill px-4" onClick={handleOpenRegister}>
                    Registrate
                  </Button>
                </>
              ) : (
                <Button variant="outline-dark" className="rounded-pill px-4" href="/dashboard">
                  Mi Panel
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Los modales viven aquí pero se controlan desde el Contexto */}
      <LoginModal />
      <RegisterModal />
    </>
  );
};

export default CustomNavbar;