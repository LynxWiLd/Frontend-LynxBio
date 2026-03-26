import { useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { FaShieldAlt, FaTimes } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleClose = () => setShowTerms(false);
  const handleShow = () => setShowTerms(true);

  return (
    <footer className={styles.footer}>
      <Container>
        <p className={styles.footerText}>
          © {currentYear} <span className={styles.brandName}>LynxBio</span> —
          Todos los derechos reservados.
        </p>

        <div className="d-flex justify-content-center align-items-center gap-2 mt-2 flex-wrap">
          <small
            className={styles.projectBadge}
            onClick={handleShow}
            style={{ cursor: "pointer" }}
          >
            Términos y Condiciones
          </small>
        </div>
      </Container>

      {/* 🪄 MODAL DE TÉRMINOS Y CONDICIONES */}
      <Modal
        show={showTerms}
        onHide={handleClose}
        centered
        scrollable
        contentClassName={styles.modalGlass}
      >
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center">
            <FaShieldAlt className="me-2 text-primary" /> Términos de Uso
          </Modal.Title>
          <Button
            variant="link"
            className="text-white p-0"
            onClick={handleClose}
          >
            <FaTimes />
          </Button>
        </Modal.Header>

        <Modal.Body className={styles.modalBodyCustom}>
          <h6 className="fw-bold text-primary">1. Aceptación del Rastro</h6>
          <p>
            Al crear tu cuenta en LynxBio, aceptás que sos el único responsable
            del contenido y los links que compartís en tu rastro digital.
          </p>

          <h6 className="fw-bold text-primary">2. Uso de Imágenes</h6>
          <p>
            Las imágenes subidas (avatares y banners) deben respetar los
            derechos de autor. LynxBio se reserva el derecho de remover
            contenido inapropiado.
          </p>

          <h6 className="fw-bold text-primary">3. Privacidad</h6>
          <p>
            Tus datos están protegidos y no serán vendidos a terceros. Solo
            mostramos la información que vos decidís hacer pública en tu perfil.
          </p>

          <h6 className="fw-bold text-primary">4. Modificaciones</h6>
          <p>
            Nos reservamos el derecho de actualizar estas reglas para mejorar la
            convivencia en la manada.
          </p>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button
            variant="primary"
            className="rounded-pill px-4 fw-bold"
            onClick={handleClose}
          >
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </footer>
  );
};

export default Footer;
