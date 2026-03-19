import { useState, useEffect, useCallback } from "react";
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

// Componentes Hij@s
import AddLinkCard from "../../components/dashboard/AddLinkCard";
import LinkItem from "../../components/dashboard/LinkItem";
import AppearanceForm from "../../components/dashboard/AppearanceForm";
import PhonePreview from "../../components/dashboard/PhonePreview";

// 🪄 CONSTANTE OFICIAL: Tu SVG para evitar deformaciones y mantener identidad
const DEFAULT_AVATAR = "https://res.cloudinary.com/dqlm5tnhk/image/upload/v1773873679/IconProfile_hoxpyj.svg";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // 🪄 FETCH DATA - Memorizado para evitar re-renders y bucles
  const fetchUserData = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      const { links: userLinks, profile, socials, theme, username } = res.data;
      
      setLinks(userLinks || []);
      setSettings({
        profile: {
          bio: profile?.bio || "",
          avatarUrl: profile?.avatarUrl || DEFAULT_AVATAR,
          username: username || "",
        },
        socials: {
          instagram: socials?.instagram || "",
          github: socials?.github || "",
          twitter: socials?.twitter || "",
        },
        theme: { ...theme },
      });
    } catch (err) {
      console.error("Error al sincronizar con la manada", err);
      Swal.fire({ 
        icon: "error", 
        title: "Sesión expirada", 
        text: "Por favor, volvé a ingresar para actualizar tu rastro.",
        background: "var(--bg-card)",
        color: "var(--text-main)"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // --- 🪄 LÓGICA DE REORDENAMIENTO CON ROLLBACK (Seguridad de Datos) ---
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const oldLinks = [...links]; // Copia de seguridad
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setLinks(items); // Actualización optimista para UX instantánea

    try {
      const newOrder = items.map((link) => link._id);
      await api.put("/links/reorder", { newOrder });
    } catch (err) {
      setLinks(oldLinks); // 🪄 ROLLBACK: Si falla la API, volvemos al orden anterior
      Swal.fire({ 
        icon: "error", 
        title: "Error al guardar orden", 
        text: "Hubo un problema de conexión. Reintentando...",
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  // --- HANDLERS DE ENLACES ---
  const handleAddLink = async (data) => {
    try {
      const res = await api.post("/links", data);
      setLinks(res.data.links || res.data); 
      Swal.fire({ icon: "success", title: "¡Link agregado!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "No se pudo crear el enlace" });
    }
  };

  const handleDeleteLink = async (id) => {
    const result = await Swal.fire({
      title: "¿Borrar este link?",
      text: "Se eliminará de tu rastro público para siempre.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      background: "var(--bg-card)",
      color: "var(--text-main)",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/links/${id}`);
        setLinks(res.data.links || res.data);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error al eliminar" });
      }
    }
  };

  // --- GESTIÓN DE APARIENCIA Y MULTIMEDIA ---
  const handleSaveSettings = async () => {
    try {
      const res = await api.put("/auth/settings", settings);
      setSettings(prev => ({ ...prev, ...res.data }));
      Swal.fire({ icon: "success", title: "¡Identidad guardada!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al guardar cambios" });
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🛡️ Validación de tamaño (Max 2MB para no saturar Cloudinary)
    if (file.size > 2 * 1024 * 1024) {
      return Swal.fire({ icon: "error", title: "Archivo pesado", text: "Máximo 2MB para que tu página cargue volando." });
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    try {
      Swal.fire({ title: "Subiendo rastro...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      
      const res = await api.post("/auth/upload-avatar", formData);
      
      setSettings(prev => {
        const updated = { ...prev };
        if (type === "avatar") updated.profile.avatarUrl = res.data.url;
        else updated.theme.backgroundImage = res.data.url;
        return updated;
      });

      Swal.fire({ icon: "success", title: "Imagen actualizada", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error en la subida", text: "Verificá tu conexión." });
    }
  };

  const handleRemoveImage = async (type) => {
    try {
      const res = await api.post("/auth/remove-image", { type });
      setSettings({
        ...settings,
        profile: res.data.profile,
        theme: res.data.theme
      });
      Swal.fire({ icon: "success", title: "Reseteo exitoso", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "No se pudo resetear" });
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${settings.profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Swal.fire({ 
      icon: "success", 
      title: "¡Rastro copiado!", 
      text: "Ya podés pegarlo en tus bios.",
      timer: 1000, 
      showConfirmButton: false,
      background: "var(--bg-card)", 
      color: "var(--text-main)" 
    });
  };

  if (loading)
    return (
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

          <Tabs defaultActiveKey="links" className={`mb-4 ${styles.customTabs}`} fill>
            <Tab eventKey="links" title={<span className={styles.tabTitle}><FaLink className="me-2" /> Mis Enlaces</span>}>
              <AddLinkCard handleAddLink={handleAddLink} />
              
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="links-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4 pb-5">
                      {links.length === 0 && (
                        <div className="text-center py-5 opacity-50">
                          <p>Todavía no dejaste rastros. ¡Agregá tu primer link!</p>
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
            </Tab>

            <Tab eventKey="appearance" title={<span className={styles.tabTitle}><FaPalette className="me-2" /> Estética</span>}>
              <AppearanceForm
                settings={settings}
                setSettings={setSettings}
                handleSaveSettings={handleSaveSettings}
                handleImageUpload={handleImageUpload}
                handleRemoveImage={handleRemoveImage}
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

      {/* VISTA PREVIA FLOTANTE (MOBILE) */}
      <div className="d-lg-none">
        <Button className={styles.mobilePreviewBtn} onClick={() => setShowMobilePreview(true)}>
          <FaEye className="me-2" /> Vista previa
        </Button>
      </div>

      <Modal 
        show={showMobilePreview} 
        onHide={() => setShowMobilePreview(false)} 
        centered 
        contentClassName={styles.mobileModalContent}
        fullscreen="sm-down"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-6 fw-bold">Previsualización de tu rastro</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`d-flex justify-content-center align-items-center ${styles.modalBody}`}>
          <PhonePreview settings={settings} links={links} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;