import { Container } from "react-bootstrap";
import styles from "./Footer.module.css";

const Footer = () => {
  // Obtenemos el año actual dinámicamente
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        {/* Texto Principal */}
        <p className={styles.footerText}>
          © {currentYear} <span className={styles.brandName}>LynxBio</span> — 
          Hecho con <span className={styles.heart}>❤️</span> en Tucumán
        </p>

        {/* Badges de Créditos */}
        <div className="d-flex justify-content-center align-items-center gap-2 mt-2 flex-wrap">
          <small className={styles.projectBadge}>
            Junior Full-Stack Project
          </small>
          
          <span className={styles.dotSeparator}>•</span>
          
          <small className={styles.rollingCode}>
            RollingCode School
          </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;