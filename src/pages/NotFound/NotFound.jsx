import React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Image } from "react-bootstrap";
// Importamos el Footer profesional que ya blindamos
import Footer from "../../components/common/Footer"; 
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.notFoundWrapper}>
      <Container className={styles.contentContainer}>
        {/* Tarjeta Glassmorphism Central */}
        <div className={styles.glassCard}>
          
          {/* Gráfico Estilizado del Lince Perdido */}
          <div className={styles.illustrationArea}>
            {/* Puedes usar una imagen real de un lince o un icono minimalista */}
            <Image 
              src="https://res.cloudinary.com/dmx6wfy3c/image/upload/v1707185461/lost-lynx_v8n0c6.png" 
              alt="Lince perdido" 
              className={styles.lynxImage}
              fluid
            />
            {/* El número de error flotante con gradient */}
            <h1 className={styles.errorCode}>404</h1>
          </div>

          {/* Textos Temáticos de LynxBio */}
          <div className={styles.textArea}>
            <h2 className={styles.messageHeading}>
              Parece que el lince <span className={styles.highlight}>perdió el rastro</span>...
            </h2>
            <p className={styles.subText}>
              La página que buscás se adentró en lo profundo del bosque digital o nunca existió. 
              No te preocupes, el rastro principal sigue intacto.
            </p>
          </div>

          {/* Botón de Acción Principal a Inicio */}
          <Button 
            as={Link} 
            to="/" 
            variant="primary" 
            className={`rounded-pill px-5 fw-bold ${styles.homeBtn}`}
          >
            VOLVER AL RASTRO (INICIO)
          </Button>
        </div>
      </Container>

      {/* 🔒 FOOTER PROFESIONAL INTEGRADO 🔒 */}
      {/* Lo envolvemos en una clase para asegurar contraste y alineación */}
      <div className={styles.footerWrapper}>
        <Footer />
      </div>
    </div>
  );
};

export default NotFound;