import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import styles from "./Navbar.module.css";

const CustomNavbar = () => {
  const { user, logout, handleOpenLogin, handleOpenRegister } =
    useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  // Solo mantenemos el efecto del scroll para el diseño Glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`${styles.navbarCustom} ${scrolled ? styles.navbarScrolled : ""} py-3`}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className={`${styles.brandContainer} d-flex align-items-center gap-2`}
        >
          {/* 🪄 NUEVO: Contenedor para la magia del logo */}
          <div className={styles.logoWrapper}>
            <img
              src="/LogoClose.svg" // Cambiá esto al nombre real
              alt="LynxBio Logo"
              className={`${styles.navbarLogo} ${styles.logoClosed}`} // Clase para boca cerrada
            />
            <img
              src="/LogoOpen.svg" // Cambiá esto al nombre real
              alt="LynxBio Logo Abierto"
              className={`${styles.navbarLogo} ${styles.logoOpen}`} // Clase para boca abierta
            />
          </div>

          <span className={styles.brandText}>Lynxbio</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {!user ? (
              <>
                <Button
                  variant="link"
                  className={`text-decoration-none ${styles.navLinkItem}`}
                  onClick={handleOpenLogin}
                >
                  Iniciá sesión
                </Button>
                <Button
                  variant="primary"
                  className="rounded-pill px-4 shadow-sm"
                  onClick={handleOpenRegister}
                >
                  Registrate
                </Button>
              </>
            ) : (
              <Dropdown align="end" className={styles.userDropdown}>
                <Dropdown.Toggle
                  className={`${styles.userToggle} d-flex align-items-center`}
                  id="dropdown-user"
                >
                  <FaUserCircle className="me-2 fs-4 text-primary" />
                  <span className="fw-bold">Hola, {user.username}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className={styles.dropdownMenu}>
                  <Dropdown.Item as={Link} to="/dashboard">
                    Mi Panel
                  </Dropdown.Item>

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
  );
};

export default CustomNavbar;
