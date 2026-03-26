// src/components/dashboard/DashboardHeader.jsx
import { Button } from "react-bootstrap";
import { FaCopy, FaCheck } from "react-icons/fa";
import styles from "../../pages/Dashboard/Dashboard.module.css";

const DashboardHeader = ({ copied, copyToClipboard }) => (
  <div className={styles.headerSection}>
    <div>
      <h2 className={styles.dashboardTitle}>Panel de Control</h2>
      <p className="text-muted small">Acomodá tus enlaces y facha en un solo lugar.</p>
    </div>
    <Button 
      variant={copied ? "success" : "outline-primary"} 
      onClick={copyToClipboard} 
      className={`rounded-pill px-4 shadow-sm ${styles.copyBtn}`}
    >
      {copied ? <FaCheck className="me-2" /> : <FaCopy className="me-2" />}
      {copied ? "¡Copiado!" : "Copiar mi Rastro"}
    </Button>
  </div>
);

export default DashboardHeader;