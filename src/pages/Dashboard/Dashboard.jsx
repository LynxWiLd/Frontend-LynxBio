import { useState, useEffect, useContext } from "react";
import { Container, Button, Tabs, Tab, Row, Col, ListGroup, Spinner, Modal } from "react-bootstrap";
import { FaCopy, FaPalette, FaLink, FaEye } from "react-icons/fa"; // Agregamos FaEye
import Swal from "sweetalert2";

import api from "../../services/axiosConfig";
import styles from "./Dashboard.module.css";

import AddLinkCard from "../../components/dashboard/AddLinkCard";
import LinkItem from "../../components/dashboard/LinkItem";
import AppearanceForm from "../../components/dashboard/AppearanceForm";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false); // Estado para el modal de celu
  
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    buttonColor: "#000000",
    buttonTextColor: "#ffffff",
  });

  const [settings, setSettings] = useState({
    profile: { bio: "", avatarUrl: "", username: "" },
    socials: { instagram: "", github: "", twitter: "" },
    theme: {
      backgroundColor: "#ffffff",
      backgroundImage: "",
      buttonColor: "#000000",
      buttonTextColor: "#ffffff",
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

  // ... (Tus funciones handleAddLink, handleDeleteLink, handleSaveSettings, handleImageUpload se mantienen igual) ...
  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/links", newLink);
      setLinks(res.data);
      setNewLink({ title: "", url: "", buttonColor: "#000000", buttonTextColor: "#ffffff" });
      Swal.fire({ icon: "success", title: "¡Link agregado!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al agregar" });
    }
  };

  const handleDeleteLink = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar enlace?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, borrar",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/links/${id}`);
        setLinks(res.data.links || res.data);
        Swal.fire({ icon: "success", title: "¡Borrado!", timer: 1000, showConfirmButton: false });
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.put("/auth/settings", settings);
      Swal.fire({ icon: "success", title: "¡Configuración guardada!", timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al guardar" });
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    try {
      Swal.fire({ title: "Subiendo...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await api.post("/auth/upload-avatar", formData);
      const newSettings = { ...settings };
      if (type === "avatar") newSettings.profile.avatarUrl = res.data.url;
      else newSettings.theme.backgroundImage = res.data.url;
      setSettings(newSettings);
      await api.put("/auth/settings", newSettings);
      Swal.fire({ icon: "success", title: "¡Imagen lista y guardada!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${settings.profile.username || ""}`;
    navigator.clipboard.writeText(url);
    Swal.fire({ icon: "info", title: "Link copiado", timer: 1500, showConfirmButton: false });
  };

  // Componente interno para no repetir el código del celular
  const PhonePreview = () => (
    <div className={styles.phoneMockup}>
      <div className={styles.phoneScreen} style={{ 
        backgroundColor: settings.theme.backgroundColor,
        backgroundImage: settings.theme.backgroundImage ? `url(${settings.theme.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        color: settings.theme.textColor 
      }}>
        <div className={styles.previewContent}>
          {settings.profile.avatarUrl ? (
            <img src={settings.profile.avatarUrl} alt="Avatar" className={styles.previewAvatar} />
          ) : (
            <div className={styles.previewAvatarPlaceholder} />
          )}
          <h5 className="fw-bold mt-3">@{settings.profile.username || "usuario"}</h5>
          <p className="small text-center px-3">{settings.profile.bio}</p>
          
          <div className={styles.previewLinks}>
            {links.map((link) => (
              <div 
                key={link._id} 
                className={styles.previewLinkItem}
                style={{ backgroundColor: settings.theme.buttonColor, color: settings.theme.buttonTextColor }}
              >
                {link.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <Container className="text-center mt-5"><Spinner animation="border" variant="primary" /><p>Sincronizando LynxBio...</p></Container>
  );

  return (
    <Container fluid className={styles.dashboardWrapper}>
      <Row className="h-100">
        {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
        <Col lg={7} xl={8} className={styles.configColumn}>
          <div className="py-4 px-md-4">
            <div className={styles.headerSection}>
              <h2 className="fw-bold">Panel de Control</h2>
              <Button variant="outline-dark" onClick={copyToClipboard} className="rounded-pill px-4 shadow-sm">
                <FaCopy className="me-2" /> Mi Link
              </Button>
            </div>

            <Tabs defaultActiveKey="links" className="mb-4 custom-tabs">
              <Tab eventKey="links" title={<span><FaLink className="me-2" /> Enlaces</span>}>
                <AddLinkCard newLink={newLink} setNewLink={setNewLink} handleAddLink={handleAddLink} />
                <ListGroup variant="flush" className="mt-4">
                  {links.map((link) => (
                    <LinkItem key={link._id} link={link} handleDeleteLink={handleDeleteLink} />
                  ))}
                </ListGroup>
              </Tab>

              <Tab eventKey="appearance" title={<span><FaPalette className="me-2" /> Apariencia</span>}>
                <AppearanceForm
                  settings={settings}
                  setSettings={setSettings}
                  handleImageUpload={handleImageUpload}
                  handleSaveSettings={handleSaveSettings}
                />
              </Tab>
            </Tabs>
          </div>
        </Col>

        {/* COLUMNA DERECHA: PREVIEW (CELULAR) - Solo visible en Escritorio */}
        <Col lg={5} xl={4} className={styles.previewColumn}>
          <div className={styles.phoneSticky}>
             <h5 className="text-muted text-center mb-3">Previsualización en vivo</h5>
             <PhonePreview />
          </div>
        </Col>
      </Row>

      {/* BOTÓN FLOTANTE PARA MÓVIL */}
      <Button 
        className={styles.mobilePreviewBtn} 
        onClick={() => setShowMobilePreview(true)}
      >
        <FaEye className="me-2" /> Vista previa
      </Button>

      {/* MODAL DE PREVIEW PARA MÓVIL */}
      <Modal 
        show={showMobilePreview} 
        onHide={() => setShowMobilePreview(false)}
        centered
        className={styles.mobileModal}
      >
        <Modal.Header closeButton className="border-0">
           <Modal.Title>Tu LynxBio</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center bg-light rounded-bottom">
           <PhonePreview />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;