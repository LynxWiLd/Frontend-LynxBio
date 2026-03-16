import { Container } from "react-bootstrap";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className="text-center">
        <p className={`mb-1 ${styles.footerText}`}>
          © {new Date().getFullYear()}{" "}
          <span className={styles.brandName}>LynxBio</span> — Hecho con{" "}
          <span className={styles.heart}>❤️</span> en Tucumán
        </p>
        <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
           <small className={styles.projectBadge}>Junior Full-Stack Project</small>
           <span className={styles.dotSeparator}>•</span>
           <small className={styles.rollingCode}>RollingCode School</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;