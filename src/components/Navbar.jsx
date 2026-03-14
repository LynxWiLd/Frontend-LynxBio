import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaRocket, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';

const CustomNavbar = () => {
  const navigate = useNavigate();
  // Aquí podrías traer el estado de auth para mostrar el nombre
  const username = localStorage.getItem('username') || 'Usuario';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold d-flex align-items-center">
          <FaRocket className="me-2 text-primary" /> LynxBio
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/dashboard" className="me-3">
              <FaUserAlt className="me-1" /> {username}
            </Nav.Link>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              <FaSignOutAlt className="me-1" /> Salir
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;