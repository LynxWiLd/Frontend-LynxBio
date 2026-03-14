import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaRocket } from 'react-icons/fa';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const CustomNavbar = () => {
  const { user, logout, handleOpenLogin, handleOpenRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="white" expand="lg" className="py-3 shadow-sm sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary d-flex align-items-center">
            <FaRocket className="me-2" /> lynxbio
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">
              {!user ? (
                <>
                  <Button variant="link" className="text-decoration-none text-dark fw-semibold" onClick={handleOpenLogin}>
                    Iniciá sesión
                  </Button>
                  <Button variant="primary" className="rounded-pill px-4 fw-bold" onClick={handleOpenRegister}>
                    Registrate
                  </Button>
                </>
              ) : (
                /* DROPDOWN CUANDO EL USUARIO ESTÁ LOGUEADO */
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" id="dropdown-user" className="rounded-pill border d-flex align-items-center px-3 py-2">
                    <FaUserCircle className="me-2 fs-4 text-primary" />
                    <span className="fw-bold text-dark">Hola, {user.username}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow border-0 mt-2">
                    <Dropdown.Item as={Link} to="/dashboard">Mi Panel</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} className="text-danger">
                      <FaSignOutAlt className="me-2" /> Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginModal />
      <RegisterModal />
    </>
  );
};

export default CustomNavbar;