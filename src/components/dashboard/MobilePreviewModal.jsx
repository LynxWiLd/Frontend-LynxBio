// src/components/dashboard/MobilePreviewModal.jsx
import { Modal, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import PhonePreview from "./PhonePreview";
import styles from "../../pages/Dashboard/Dashboard.module.css";

const MobilePreviewModal = ({ show, onHide, settings, links }) => (
  <>
    <div className="d-lg-none">
      <Button className={styles.mobilePreviewBtn} onClick={() => onHide(true)}>
        <FaEye className="me-2" /> Vista previa
      </Button>
    </div>

    <Modal 
      show={show} 
      onHide={() => onHide(false)} 
      centered 
      contentClassName={styles.mobileModalContent}
      fullscreen="sm-down"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-6 fw-bold">Previsualización</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`d-flex justify-content-center align-items-center ${styles.modalBody}`}>
        <PhonePreview settings={settings} links={links} />
      </Modal.Body>
    </Modal>
  </>
);

export default MobilePreviewModal;