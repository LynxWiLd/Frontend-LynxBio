import { Container, Row, Col, Tabs, Tab, Spinner } from "react-bootstrap";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { FaLink, FaPalette } from "react-icons/fa";

import { useDashboard } from "../../hooks/useDashboard";
import styles from "./Dashboard.module.css";

// Componentes Hij@s
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import MobilePreviewModal from "../../components/dashboard/MobilePreviewModal";
import AddLinkCard from "../../components/dashboard/AddLinkCard";
import LinkItem from "../../components/dashboard/LinkItem";
import AppearanceForm from "../../components/dashboard/AppearanceForm";
import PhonePreview from "../../components/dashboard/PhonePreview";

const Dashboard = () => {
  const { 
    links, settings, setSettings, loading, copied, showMobilePreview,
    setShowMobilePreview, handleDragEnd, handleAddLink, handleDeleteLink,
    handleSaveSettings, copyToClipboard 
  } = useDashboard();

  if (loading) return (
    <div className={styles.loaderContainer}>
      <Spinner animation="grow" variant="primary" />
      <p className={styles.loadingText}>Sincronizando con la manada...</p>
    </div>
  );

  return (
    <Container fluid className={styles.dashboardWrapper}>
      <Row className="h-100 g-4 animate__animated animate__fadeIn">
        
        {/* COLUMNA DE CONFIGURACIÓN */}
        <Col lg={7} xl={8} className={styles.configColumn}>
          <DashboardHeader copied={copied} copyToClipboard={copyToClipboard} />

          <Tabs defaultActiveKey="links" className={`mb-4 ${styles.customTabs}`} fill>
            <Tab eventKey="links" title={<span className={styles.tabTitle}><FaLink className="me-2" /> Enlaces</span>}>
              <AddLinkCard handleAddLink={handleAddLink} />
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="links-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4 pb-5">
                      {links.length === 0 && <p className="text-center py-5 opacity-50">Tu rastro está vacío.</p>}
                      {links.map((link, index) => (
                        <LinkItem key={link._id} link={link} index={index} handleDeleteLink={handleDeleteLink} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Tab>

            <Tab eventKey="appearance" title={<span className={styles.tabTitle}><FaPalette className="me-2" /> Estética</span>}>
              <AppearanceForm
                settings={settings}
                setSettings={setSettings}
                handleSaveSettings={handleSaveSettings}
              />
            </Tab>
          </Tabs>
        </Col>

        {/* COLUMNA VISTA PREVIA (DESKTOP) */}
        <Col lg={5} xl={4} className={`d-none d-lg-block ${styles.previewColumn}`}>
          <div className={styles.phoneSticky}>
            <PhonePreview settings={settings} links={links} />
          </div>
        </Col>
      </Row>

      <MobilePreviewModal 
        show={showMobilePreview} 
        onHide={setShowMobilePreview} 
        settings={settings} 
        links={links} 
      />
    </Container>
  );
};

export default Dashboard;