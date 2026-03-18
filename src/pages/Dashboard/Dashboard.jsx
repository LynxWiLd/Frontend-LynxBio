import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Tabs,
  Tab,
  Row,
  Col,
  Spinner,
  Modal,
} from "react-bootstrap";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { FaCopy, FaPalette, FaLink, FaEye, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";

import api from "../../services/axiosConfig";
import styles from "./Dashboard.module.css";

// Componentes
import AddLinkCard from "../../components/dashboard/AddLinkCard";
import LinkItem from "../../components/dashboard/LinkItem";
import AppearanceForm from "../../components/dashboard/AppearanceForm";
import PhonePreview from "../../components/dashboard/PhonePreview";

// 🪄 CONSTANTE: Imagen por defecto para evitar deformaciones
const DEFAULT_AVATAR = "https://res.cloudinary.com/dmx6wfy3c/image/upload/v1707185461/default-avatar-lynx_v8n0c6.png";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [copied, setCopied] = useState(false); // Feedback visual para el copy

  const [settings, setSettings] = useState({
    profile: { bio: "", avatarUrl: "", username: "" },
    socials: { instagram: "", github: "", twitter: "" },
    theme: {
      backgroundColor: "#ffffff",
      backgroundImage: "",
      buttonColor: "#000000",
      textColor: "#000000",
    },
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/auth/me");
      setLinks(res.data.links || []);
      
      // 🪄 FIX AVATAR: Si no viene avatar, se mantiene el string vacío pero lo manejamos en el render
      setSettings({
        profile: {
          bio: res.data.profile?.bio || "",
          avatarUrl: res.data.profile?.avatarUrl || "",
          username: res.data.username || "",
        },
        socials: {
          instagram: res.data.socials?.instagram || "",
          github: res.data.socials?.github || "",
          twitter: res.data.socials?.twitter || "",
        },
        theme: { ...res.data.theme },
      });
    } catch (err) {
      console.error("Error al cargar datos", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE REORDENAMIENTO ---
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLinks(items);

    try {
      const newOrder = items.map((link) => link._id);
      await api.put("/links/reorder", { newOrder });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al guardar orden", background: "var(--bg-card)", color: "var(--text-main)" });
    }
  };

  // --- HANDLERS ---
  const handleAddLink = async (data) => {
    try {
      const res = await api.post("/links", data);
      setLinks(res.data);
      Swal.fire({ icon: "success", title: "¡Link agregado!", timer: 1500, showConfirmButton: false, background: "var(--bg-card)", color: "var(--text-main)" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", background: "var(--bg-card)", color: "var(--text-main)" });
    }
  };

  const handleDeleteLink = async (id) => {
    const result = await Swal.fire({
      title: "¿Borrar este link?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, borrar",
      background: "var(--bg-card)",
      color: "var(--text-main)",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/links/${id}`);
        setLinks(res.data.links || res.data);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", background: "var(--bg-card)", color: "var(--text-main)" });
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.put("/auth/settings", settings);
      Swal.fire({ icon: "success", title: "¡Apariencia guardada!", timer: 1500, showConfirmButton: false, background: "var(--bg-card)", color: "var(--text-main)" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", background: "var(--bg-card)", color: "var(--text-main)" });
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    try {
      Swal.fire({ title: "Subiendo obra...", background: "var(--bg-card)", color: "var(--text-main)", didOpen: () => Swal.showLoading() });
      const res = await api.post("/auth/upload-avatar", formData);
      const newSettings = { ...settings };
      if (type === "avatar") newSettings.profile.avatarUrl = res.data.url;
      else newSettings.theme.backgroundImage = res.data.url;
      setSettings(newSettings);
      await api.put("/auth/settings", newSettings);
      Swal.close();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al subir", background: "var(--bg-card)", color: "var(--text-main)" });
    }
  };

  const handleRemoveImage = async (type) => {
    const newSettings = { ...settings };
    if (type === "avatar") newSettings.profile.avatarUrl = "";
    else newSettings.theme.backgroundImage = "";
    setSettings(newSettings);
    await api.put("/auth/settings", newSettings);
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${settings.profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset del icono tras 2 segs
    Swal.fire({ icon: "success", title: "¡Rastro copiado!", timer: 1000, showConfirmButton: false, background: "var(--bg-card)", color: "var(--text-main)" });
  };

  if (loading)
    return (
      <div className={styles.loaderContainer}>
        <Spinner animation="border" variant="primary" />
        <p className={styles.loadingText}>Sincronizando con la manada...</p>
      </div>
    );

  // 🪄 Preparamos los datos para la preview con el avatar por defecto si está vacío
  const previewSettings = {
    ...settings,
    profile: {
      ...settings.profile,
      avatarUrl: settings.profile.avatarUrl || DEFAULT_AVATAR
    }
  };

  return (
    <Container fluid className={styles.dashboardWrapper}>
      <Row className="h-100 g-4">
        {/* COLUMNA DE CONFIGURACIÓN */}
        <Col lg={7} xl={8} className={styles.configColumn}>
          <div className={styles.headerSection}>
            <div>
              <h2 className={styles.dashboardTitle}>Panel de Control</h2>
              <p className="text-muted small">Personaliza tu rastro digital en segundos.</p>
            </div>
            <Button 
              variant={copied ? "success" : "outline-primary"} 
              onClick={copyToClipboard} 
              className={`rounded-pill px-4 ${styles.copyBtn}`}
            >
              {copied ? <FaCheck className="me-2" /> : <FaCopy className="me-2" />}
              {copied ? "Copiado" : "Mi Link"}
            </Button>
          </div>

          <Tabs defaultActiveKey="links" className={`mb-4 ${styles.customTabs}`} fill>
            <Tab eventKey="links" title={<span className={styles.tabTitle}><FaLink className="me-2" /> Enlaces</span>}>
              <div className="animate__animated animate__fadeIn">
                <AddLinkCard handleAddLink={handleAddLink} />
                
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="links-list">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4 pb-5">
                        {links.length === 0 && (
                          <div className="text-center py-5 opacity-50">
                            <p>No hay enlaces aún. ¡Agregá el primero!</p>
                          </div>
                        )}
                        {links.map((link, index) => (
                          <LinkItem
                            key={link._id}
                            link={link}
                            index={index}
                            handleDeleteLink={handleDeleteLink}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </Tab>

            <Tab eventKey="appearance" title={<span className={styles.tabTitle}><FaPalette className="me-2" /> Apariencia</span>}>
              <div className="animate__animated animate__fadeIn">
                <AppearanceForm
                  settings={settings}
                  setSettings={setSettings}
                  handleSaveSettings={handleSaveSettings}
                  handleImageUpload={handleImageUpload}
                  handleRemoveImage={handleRemoveImage}
                />
              </div>
            </Tab>
          </Tabs>
        </Col>

        {/* COLUMNA VISTA PREVIA ESCRITORIO (Solo visible en LG+) */}
        <Col lg={5} xl={4} className={`d-none d-lg-block ${styles.previewColumn}`}>
          <div className={styles.phoneSticky}>
            <PhonePreview settings={previewSettings} links={links} />
          </div>
        </Col>
      </Row>

      {/* BOTÓN VISTA PREVIA MÓVIL (Solo visible en pantallas chicas) */}
      <div className="d-lg-none">
        <Button className={styles.mobilePreviewBtn} onClick={() => setShowMobilePreview(true)}>
          <FaEye className="me-2" /> Ver mi página
        </Button>
      </div>

      {/* MODAL VISTA PREVIA MÓVIL */}
      <Modal 
        show={showMobilePreview} 
        onHide={() => setShowMobilePreview(false)} 
        centered 
        contentClassName={styles.mobileModalContent}
        fullscreen="sm-down"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-6 fw-bold">Vista Previa</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`d-flex justify-content-center align-items-center ${styles.modalBody}`}>
          <PhonePreview settings={previewSettings} links={links} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;