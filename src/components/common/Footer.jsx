import { Container } from "react-bootstrap";
import styles from "./Footer.module.css"; // Importamos los estilos

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className="text-center">
        <p className="mb-0">
          © {new Date().getFullYear()}{" "}
          <span className={styles.brandName}>LynxBio</span> - Hecho con{" "}
          <span className={styles.heart}>❤️</span> en Tucumán
        </p>
        <small className={styles.projectBadge}>Junior Full-Stack Project</small>
      </Container>
    </footer>
  );
};

export default Footer;
