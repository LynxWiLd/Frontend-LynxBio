import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle, FaSignOutAlt, FaRocket } from "react-icons/fa";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import styles from "./Navbar.module.css"; // Importamos estilos

const CustomNavbar = () => {
  const { user, logout, handleOpenLogin, handleOpenRegister } =
    useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  // Detectar el scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top" // Cambiamos sticky por fixed para que flote sobre el hero
        className={`${styles.navbarCustom} ${scrolled ? styles.navbarScrolled : ""} py-3`}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className={`fw-bold fs-3 text-primary d-flex align-items-center ${styles.brandLogo}`}
          >
            {/* REEMPLAZO: Cambiamos FaRocket por la imagen del logo */}
            <img
              src="./Logo.svg"
              alt="LynxBio Logo"
              className={styles.navbarLogo}
            />
            <span className="ms-2">lynxbio</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">
              {!user ? (
                <>
                  <Button
                    variant="link"
                    className={`text-decoration-none text-dark ${styles.navButton}`}
                    onClick={handleOpenLogin}
                  >
                    Iniciá sesión
                  </Button>
                  <Button
                    variant="primary"
                    className={`rounded-pill px-4 shadow-sm ${styles.navButton}`}
                    onClick={handleOpenRegister}
                  >
                    Registrate
                  </Button>
                </>
              ) : (
                <Dropdown align="end" className={styles.userDropdown}>
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-user"
                    className="d-flex align-items-center"
                  >
                    <FaUserCircle className="me-2 fs-4 text-primary" />
                    <span className="fw-bold text-dark">
                      Hola, {user.username}
                    </span>
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

      <LoginModal />
      <RegisterModal />
    </>
  );
};

export default CustomNavbar;
