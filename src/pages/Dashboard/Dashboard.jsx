import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Tabs,
  Tab,
  Row,
  Col,
  ListGroup,
  Spinner,
  Modal,
} from "react-bootstrap";
import { FaCopy, FaPalette, FaLink, FaEye } from "react-icons/fa";
import { FaInstagram, FaGithub, FaXTwitter } from "react-icons/fa6";
import Swal from "sweetalert2";

import api from "../../services/axiosConfig";
import styles from "./Dashboard.module.css";

import AddLinkCard from "../../components/dashboard/AddLinkCard";
import LinkItem from "../../components/dashboard/LinkItem";
import AppearanceForm from "../../components/dashboard/AppearanceForm";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

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

  // --- FUNCIÓN: AGREGAR LINK ---
  const handleAddLink = async (data) => {
    try {
      const res = await api.post("/links", data);
      setLinks(res.data);
      Swal.fire({
        icon: "success",
        title: "¡Link agregado!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al agregar el link" });
    }
  };

  // --- FUNCIÓN: BORRAR LINK ---
  const handleDeleteLink = async (id) => {
    const result = await Swal.fire({
      title: "¿Borrar este link?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, borrar",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/links/${id}`);
        setLinks(res.data.links || res.data);
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  // --- FUNCIÓN: GUARDAR APARIENCIA ---
  const handleSaveSettings = async () => {
    try {
      await api.put("/auth/settings", settings);
      Swal.fire({
        icon: "success",
        title: "¡Apariencia guardada!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al guardar configuración" });
    }
  };

  // --- FUNCIÓN: SUBIR IMÁGENES (Avatar o Fondo) ---
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return Swal.fire("Archivo muy pesado", "Máximo 2MB", "warning");
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    try {
      Swal.fire({
        title: "Subiendo obra de arte...",
        didOpen: () => Swal.showLoading(),
      });
      const res = await api.post("/auth/upload-avatar", formData);

      const newSettings = { ...settings };
      if (type === "avatar") newSettings.profile.avatarUrl = res.data.url;
      else newSettings.theme.backgroundImage = res.data.url;

      setSettings(newSettings);
      await api.put("/auth/settings", newSettings); // Auto-save
      Swal.fire({
        icon: "success",
        title: "¡Imagen lista!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  };

  // --- FUNCIÓN: ELIMINAR IMÁGENES (Avatar o Fondo) ---
  const handleRemoveImage = async (type) => {
    const result = await Swal.fire({
      title: `¿Quitar ${type === "avatar" ? "foto de perfil" : "fondo"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const newSettings = { ...settings };
        if (type === "avatar") {
          newSettings.profile.avatarUrl = "";
        } else {
          newSettings.theme.backgroundImage = "";
        }

        setSettings(newSettings);
        await api.put("/auth/settings", newSettings);

        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${settings.profile.username}`;
    navigator.clipboard.writeText(url);
    Swal.fire({
      icon: "info",
      title: "¡Link copiado!",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const PhonePreview = () => (
    <div className={styles.phoneMockup}>
      <div
        className={styles.phoneScreen}
        style={{
          backgroundColor: settings.theme.backgroundColor,
          backgroundImage: settings.theme.backgroundImage
            ? `url(${settings.theme.backgroundImage})`
            : "none",
        }}
      >
        {/* Capa oscura si hay fondo (igual que en PublicPage) */}
        {settings.theme.backgroundImage && (
          <div className={styles.phoneOverlay} />
        )}

        <div
          className={styles.phoneGlassCard}
          style={{ color: settings.theme.textColor }}
        >
          <img
            src={
              settings.profile.avatarUrl || "https://via.placeholder.com/150"
            }
            className={styles.previewAvatar}
            style={{ borderColor: settings.theme.buttonColor }}
            alt="Avatar"
          />
          <h5 className="fw-bold mt-2">
            @{settings.profile.username || "usuario"}
          </h5>
          <p className={styles.previewBio}>{settings.profile.bio}</p>

          <div className={styles.previewLinks}>
            {links.map((link) => (
              <div
                key={link._id}
                className={styles.previewLinkItem}
                style={{
                  backgroundColor: link.buttonColor,
                  color: link.buttonTextColor,
                  backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1))`,
                }}
              >
                {link.title}
              </div>
            ))}
          </div>

          <div className={styles.socialIconsPreview}>
            {settings.socials.instagram && <FaInstagram className="mx-2" />}
            {settings.socials.github && <FaGithub className="mx-2" />}
            {settings.socials.twitter && <FaXTwitter className="mx-2" />}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Sincronizando con la manada...</p>
      </Container>
    );

  return (
    <Container fluid className={styles.dashboardWrapper}>
      <Row className="h-100">
        <Col lg={7} xl={8} className={styles.configColumn}>
          <div className={styles.headerSection}>
            <h2 className="fw-bold">Panel de Control</h2>
            <Button
              variant="outline-dark"
              onClick={copyToClipboard}
              className="rounded-pill px-4"
            >
              <FaCopy className="me-2" /> Mi Link
            </Button>
          </div>

          <Tabs defaultActiveKey="links" className="mb-4">
            <Tab
              eventKey="links"
              title={
                <span>
                  <FaLink className="me-2" /> Enlaces
                </span>
              }
            >
              {/* 👈 AGREGAMOS EL FORMULARIO PARA CREAR LINKS */}
              <AddLinkCard handleAddLink={handleAddLink} />

              <ListGroup variant="flush" className="mt-4">
                {links.map((link) => (
                  <LinkItem
                    key={link._id}
                    link={link}
                    handleDeleteLink={handleDeleteLink}
                  />
                ))}
              </ListGroup>
            </Tab>

            <Tab
              eventKey="appearance"
              title={
                <span>
                  <FaPalette className="me-2" /> Apariencia
                </span>
              }
            >
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

        <Col lg={5} xl={4} className={styles.previewColumn}>
          <div className={styles.phoneSticky}>
            <PhonePreview />
          </div>
        </Col>
      </Row>

      <Button
        className={styles.mobilePreviewBtn}
        onClick={() => setShowMobilePreview(true)}
      >
        <FaEye className="me-2" /> Vista previa
      </Button>

      <Modal
        show={showMobilePreview}
        onHide={() => setShowMobilePreview(false)}
        centered
        className={styles.mobileModal}
      >
        <Modal.Body className="d-flex justify-content-center bg-light rounded">
          <PhonePreview />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;
