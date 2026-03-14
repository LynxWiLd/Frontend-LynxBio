import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa"; // Sumamos Moon y Sun
import styles from "./Navbar.module.css";

const CustomNavbar = () => {
  const { user, logout, handleOpenLogin, handleOpenRegister } =
    useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  // 1. Lógica de Dark Mode
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
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
        <Navbar.Brand as={Link} to="/" className={styles.brandContainer}>
          <img
            src="/Logo.svg"
            alt="LynxBio Logo"
            className={styles.navbarLogo}
          />
          <span className={styles.brandText}>Lynxbio</span>
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

                  {/* 👈 BOTÓN DE DARK MODE */}
                  <Dropdown.Item onClick={() => setIsDark(!isDark)}>
                    {isDark ? (
                      <div className="d-flex align-items-center">
                        <FaSun className="me-2 text-warning" /> Modo Claro
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <FaMoon className="me-2 text-primary" /> Modo Oscuro
                      </div>
                    )}
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
