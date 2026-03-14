import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Tabs,
  Tab,
  ListGroup,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import {
  FaPlus,
  FaTrashAlt,
  FaExternalLinkAlt,
  FaSave,
  FaCopy,
  FaPalette,
  FaLink,
  FaInstagram,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../api/axios";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  
  // Estado unificado para toda la configuración
  const [settings, setSettings] = useState({
    profile: { bio: "", avatarUrl: "", username: "" },
    socials: { instagram: "", github: "", twitter: "" },
    theme: {
      backgroundColor: "#ffffff",
      buttonColor: "#000000",
      buttonTextColor: "#ffffff",
    },
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/auth/me");
      setLinks(res.data.links || []);
      
      // Cargamos los datos asegurándonos de que no queden como undefined
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
        theme: res.data.theme || {
          backgroundColor: "#ffffff",
          buttonColor: "#000000",
          buttonTextColor: "#ffffff",
        },
      });
    } catch (err) {
      console.error("Error al cargar datos", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Gestión de Enlaces (Botones grandes) ---
  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/links", newLink);
      setLinks(res.data);
      setNewLink({ title: "", url: "" });
      Swal.fire({ icon: "success", title: "¡Link agregado!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo agregar" });
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
        const updatedLinks = res.data.links ? res.data.links : res.data;
        setLinks(updatedLinks);
        Swal.fire({ icon: "success", title: "¡Borrado!", timer: 1000, showConfirmButton: false });
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  // --- GUARDAR CONFIGURACIÓN (Bio, Redes y Colores) ---
  const handleSaveSettings = async () => {
    try {
      // Enviamos el objeto settings completo
      await api.put("/auth/settings", settings);
      Swal.fire({ icon: "success", title: "¡Todo guardado!", text: "Los cambios ya están en tu página pública", timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al guardar", text: "Revisá tu conexión o intentá más tarde" });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      Swal.fire({ title: "Subiendo...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await api.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSettings(prev => ({ ...prev, profile: { ...prev.profile, avatarUrl: res.data.url } }));
      Swal.fire({ icon: "success", title: "¡Foto actualizada!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${settings.profile.username || ""}`;
    navigator.clipboard.writeText(url);
    Swal.fire({ icon: "info", title: "URL Copiada", text: "Ya puedes pegarla en tu bio", timer: 2000 });
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" variant="primary" /><p>Cargando LynxBio...</p></Container>;

  return (
    <Container className="mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Control</h2>
        <Button variant="outline-dark" onClick={copyToClipboard}><FaCopy className="me-2" /> Mi Link</Button>
      </div>

      <Tabs defaultActiveKey="links" className="mb-4">
        <Tab eventKey="links" title={<span><FaLink className="me-2" />Enlaces</span>}>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="mb-4 shadow-sm border-0 bg-light p-3">
                <Form onSubmit={handleAddLink}>
                  <Row className="g-2">
                    <Col md={5}><Form.Control placeholder="Título del botón" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} required /></Col>
                    <Col md={5}><Form.Control placeholder="URL (ej: https://...)" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} required /></Col>
                    <Col md={2}><Button variant="primary" type="submit" className="w-100"><FaPlus /></Button></Col>
                  </Row>
                </Form>
              </Card>
              <ListGroup className="shadow-sm">
                {links.map((link) => (
                  <ListGroup.Item key={link._id} className="d-flex justify-content-between align-items-center p-3">
                    <div><h6 className="mb-0 fw-bold">{link.title}</h6><small className="text-muted">{link.url}</small></div>
                    <div className="d-flex gap-2">
                      <Button variant="light" size="sm" href={link.url} target="_blank"><FaExternalLinkAlt /></Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLink(link._id)}><FaTrashAlt /></Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="appearance" title={<span><FaPalette className="me-2" />Apariencia</span>}>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="shadow-sm border-0 p-4">
                {/* Foto de Perfil */}
                <div className="text-center mb-4">
                  <img src={settings.profile.avatarUrl || "https://via.placeholder.com/150"} alt="Avatar" className="rounded-circle mb-3 shadow" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                  <Form.Control type="file" size="sm" onChange={handleImageUpload} accept="image/*" />
                </div>

                {/* Biografía */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Bio</Form.Label>
                  <Form.Control as="textarea" rows={2} value={settings.profile.bio} onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, bio: e.target.value } })} />
                </Form.Group>

                {/* Redes Sociales */}
                <div className="mb-4">
                  <Form.Label className="fw-bold">Redes Sociales (URLs Reales)</Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text><FaInstagram /></InputGroup.Text>
                    <Form.Control 
                      placeholder="https://instagram.com/tu-usuario" 
                      value={settings.socials.instagram} 
                      onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })} 
                    />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text><FaGithub /></InputGroup.Text>
                    <Form.Control 
                      placeholder="https://github.com/tu-usuario" 
                      value={settings.socials.github} 
                      onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, github: e.target.value } })} 
                    />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text><FaTwitter /></InputGroup.Text>
                    <Form.Control 
                      placeholder="https://twitter.com/tu-usuario" 
                      value={settings.socials.twitter} 
                      onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, twitter: e.target.value } })} 
                    />
                  </InputGroup>
                </div>

                {/* Colores */}
                <Row className="mb-4 text-center">
                  <Col>
                    <Form.Label className="fw-bold d-block">Fondo</Form.Label>
                    <Form.Control type="color" className="mx-auto" value={settings.theme.backgroundColor} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, backgroundColor: e.target.value } })} />
                  </Col>
                  <Col>
                    <Form.Label className="fw-bold d-block">Botones</Form.Label>
                    <Form.Control type="color" className="mx-auto" value={settings.theme.buttonColor} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, buttonColor: e.target.value } })} />
                  </Col>
                </Row>

                <Button variant="primary" className="w-100 fw-bold py-2" onClick={handleSaveSettings}>
                  <FaSave className="me-2" /> GUARDAR TODO
                </Button>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Dashboard;