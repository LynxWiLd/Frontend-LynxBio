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
} from "react-bootstrap";
import { FaCopy, FaPalette, FaLink } from "react-icons/fa";
import Swal from "sweetalert2";

// Importación de Servicios y Estilos
import api from "../../services/axiosConfig";
import styles from "./Dashboard.module.css";

// Importación de Sub-componentes (Nuestra nueva arquitectura)
import AddLinkCard from "../../components/dashboard/AddLinkCard";
import LinkItem from "../../components/dashboard/LinkItem";
import AppearanceForm from "../../components/dashboard/AppearanceForm";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // --- LÓGICA DE DATOS ---
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

  // --- MANEJO DE ENLACES ---
  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/links", newLink);
      setLinks(res.data);
      setNewLink({
        title: "",
        url: "",
        buttonColor: "#000000",
        buttonTextColor: "#ffffff",
      });
      Swal.fire({
        icon: "success",
        title: "¡Link agregado!",
        timer: 1500,
        showConfirmButton: false,
      });
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
        Swal.fire({
          icon: "success",
          title: "¡Borrado!",
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  // --- MANEJO DE CONFIGURACIÓN Y SUBIDAS ---
  const handleSaveSettings = async () => {
    try {
      await api.put("/auth/settings", settings);
      Swal.fire({
        icon: "success",
        title: "¡Configuración guardada!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al guardar" });
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      Swal.fire({
        title: "Subiendo...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const res = await api.post("/auth/upload-avatar", formData);

      if (type === "avatar") {
        setSettings((prev) => ({
          ...prev,
          profile: { ...prev.profile, avatarUrl: res.data.url },
        }));
      } else {
        setSettings((prev) => ({
          ...prev,
          theme: { ...prev.theme, backgroundImage: res.data.url },
        }));
      }

      Swal.fire({
        icon: "success",
        title: "¡Imagen lista!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo subir", "error");
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${settings.profile.username || ""}`;
    navigator.clipboard.writeText(url);
    Swal.fire({
      icon: "info",
      title: "Link copiado al portapapeles",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Sincronizando LynxBio...</p>
      </Container>
    );

  return (
    <Container className={styles.dashboardContainer}>
      {/* HEADER DEL PANEL */}
      <div className={styles.headerSection}>
        <h2>Panel de Control</h2>
        <Button
          variant="outline-dark"
          onClick={copyToClipboard}
          className="rounded-pill px-4 shadow-sm"
        >
          <FaCopy className="me-2" /> Mi Link
        </Button>
      </div>

      <Tabs defaultActiveKey="links" className="mb-4 custom-tabs">
        {/* PESTAÑA: ENLACES */}
        <Tab
          eventKey="links"
          title={
            <span>
              <FaLink className="me-2" /> Enlaces
            </span>
          }
        >
          <Row className="justify-content-center">
            <Col md={8}>
              <AddLinkCard
                newLink={newLink}
                setNewLink={setNewLink}
                handleAddLink={handleAddLink}
              />

              <ListGroup variant="flush" className="mt-4">
                {links.map((link) => (
                  <LinkItem
                    key={link._id}
                    link={link}
                    handleDeleteLink={handleDeleteLink}
                  />
                ))}
              </ListGroup>

              {links.length === 0 && (
                <div className="text-center mt-5 opacity-50">
                  <p>Aún no tienes enlaces. ¡Agrega el primero arriba!</p>
                </div>
              )}
            </Col>
          </Row>
        </Tab>

        {/* PESTAÑA: APARIENCIA */}
        <Tab
          eventKey="appearance"
          title={
            <span>
              <FaPalette className="me-2" /> Apariencia
            </span>
          }
        >
          <Row className="justify-content-center">
            <Col md={6}>
              <AppearanceForm
                settings={settings}
                setSettings={setSettings}
                handleImageUpload={handleImageUpload}
                handleSaveSettings={handleSaveSettings}
              />
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Dashboard;
