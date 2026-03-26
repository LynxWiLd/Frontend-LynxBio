import { Navbar, Nav, Container, Button, Dropdown, Image } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaSignOutAlt, FaColumns } from "react-icons/fa";
import styles from "./Navbar.module.css";

const CustomNavbar = () => {
  const { user, logout, handleOpenLogin, handleOpenRegister } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // 🪄 Para saber si estamos en el dashboard

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`${styles.navbarCustom} ${scrolled ? styles.navbarScrolled : ""} py-2`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className={styles.brandContainer}>
          <div className={styles.logoWrapper}>
            <img src="/LogoClose.svg" alt="LynxBio" className={`${styles.navbarLogo} ${styles.logoClosed}`} />
            <img src="/LogoOpen.svg" alt="LynxBio" className={`${styles.navbarLogo} ${styles.logoOpen}`} />
          </div>
          <span className={styles.brandText}>Lynxbio</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2 gap-lg-3 mt-3 mt-lg-0">
            {!user ? (
              <>
                <Button variant="link" className={styles.navLinkItem} onClick={handleOpenLogin}>
                  Iniciá sesión
                </Button>
                <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleOpenRegister}>
                  Registrate
                </Button>
              </>
            ) : (
              <Dropdown align="end" className={styles.userDropdown}>
                <Dropdown.Toggle id="dropdown-user" className={styles.userToggle}>
                  {/* 🪄 Avatar Real del Lince */}
                  <Image 
                    src={user.profile?.avatarUrl || "/default-avatar.png"} 
                    roundedCircle 
                    className={styles.navAvatar}
                  />
                  <span className={styles.usernameText}>Hola, {user.username}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className={styles.dropdownMenu}>
                  <Dropdown.Header className="small text-muted">Mi Rastro</Dropdown.Header>
                  <Dropdown.Item 
                    as={Link} 
                    to="/dashboard" 
                    className={location.pathname === "/dashboard" ? styles.activeItem : ""}
                  >
                    <FaColumns className="me-2" /> Panel de Control
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item onClick={logout} className={styles.logoutItem}>
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