import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Tabs, Tab, ListGroup, Spinner, InputGroup } from "react-bootstrap";
import { FaPlus, FaTrashAlt, FaSave, FaCopy, FaPalette, FaLink, FaImage } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../services/axiosConfig";
import styles from "./Dashboard.module.css"; // 1. Importamos los estilos

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({ title: "", url: "", buttonColor: "#000000", buttonTextColor: "#ffffff" });

  const [settings, setSettings] = useState({
    profile: { bio: "", avatarUrl: "", username: "" },
    socials: { instagram: "", github: "", twitter: "" },
    theme: { backgroundColor: "#ffffff", backgroundImage: "", buttonColor: "#000000", buttonTextColor: "#ffffff", textColor: "#000000" },
  });

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/auth/me");
      setLinks(res.data.links || []);
      setSettings({
        profile: { bio: res.data.profile?.bio || "", avatarUrl: res.data.profile?.avatarUrl || "", username: res.data.username || "" },
        socials: { instagram: res.data.socials?.instagram || "", github: res.data.socials?.github || "", twitter: res.data.socials?.twitter || "" },
        theme: { ...res.data.theme }
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/links", newLink);
      setLinks(res.data);
      setNewLink({ title: "", url: "", buttonColor: "#000000", buttonTextColor: "#ffffff" });
      Swal.fire({ icon: "success", title: "¡Link tematizado!", timer: 1500, showConfirmButton: false });
    } catch (err) { Swal.fire({ icon: "error", title: "Error" }); }
  };

  const handleDeleteLink = async (id) => {
    const result = await Swal.fire({ title: "¿Eliminar enlace?", icon: "warning", showCancelButton: true });
    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/links/${id}`);
        setLinks(res.data.links || res.data);
      } catch (err) { Swal.fire("Error", "No se pudo eliminar", "error"); }
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.put("/auth/settings", settings);
      Swal.fire({ icon: "success", title: "¡Todo guardado!", timer: 2000, showConfirmButton: false });
    } catch (err) { Swal.fire({ icon: "error", title: "Error" }); }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      Swal.fire({ title: "Subiendo...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await api.post("/auth/upload-avatar", formData);
      if (type === 'avatar') {
        setSettings(prev => ({ ...prev, profile: { ...prev.profile, avatarUrl: res.data.url } }));
      } else {
        setSettings(prev => ({ ...prev, theme: { ...prev.theme, backgroundImage: res.data.url } }));
      }
      Swal.fire({ icon: "success", title: "¡Actualizado!", timer: 1500, showConfirmButton: false });
    } catch (err) { Swal.fire("Error", "Falló la subida", "error"); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${settings.profile.username || ""}`);
    Swal.fire({ icon: "info", title: "URL Copiada", timer: 1500 });
  };

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
      <p>Cargando LynxBio...</p>
    </Container>
  );

  return (
    <Container className={styles.dashboardContainer}>
      <div className={styles.headerSection}>
        <h2>Panel de Control</h2>
        <Button variant="outline-dark" onClick={copyToClipboard} className="rounded-pill px-4">
          <FaCopy className="me-2" /> Mi Link
        </Button>
      </div>

      <Tabs defaultActiveKey="links" className="mb-4 custom-tabs">
        <Tab eventKey="links" title={<span><FaLink className="me-2" />Enlaces</span>}>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className={`${styles.glassCard} mb-4 bg-light`}>
                <Form onSubmit={handleAddLink}>
                  <Row className="g-2 mb-3">
                    <Col md={6}><Form.Control placeholder="Título (ej: WhatsApp)" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} required /></Col>
                    <Col md={6}><Form.Control placeholder="URL (https://...)" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} required /></Col>
                  </Row>
                  <Row className="g-2 align-items-center">
                    <Col xs={4}>
                      <Form.Label className="small fw-bold">Color Botón</Form.Label>
                      <Form.Control type="color" className={styles.colorInputCustom} value={newLink.buttonColor} onChange={(e) => setNewLink({ ...newLink, buttonColor: e.target.value })} />
                    </Col>
                    <Col xs={4}>
                      <Form.Label className="small fw-bold">Color Texto</Form.Label>
                      <Form.Control type="color" className={styles.colorInputCustom} value={newLink.buttonTextColor} onChange={(e) => setNewLink({ ...newLink, buttonTextColor: e.target.value })} />
                    </Col>
                    <Col xs={4}>
                      <Button variant="primary" type="submit" className={`${styles.primaryBtn} w-100 mt-3`}>
                        <FaPlus className="me-2" /> AGREGAR
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
              <ListGroup variant="flush">
                {links.map((link) => (
                  <ListGroup.Item key={link._id} className={styles.linkItem}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0 fw-bold">{link.title}</h6>
                        <small className="text-muted">{link.url}</small>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div className={styles.statusIndicator} style={{ backgroundColor: link.buttonColor }} />
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLink(link._id)} className="rounded-circle">
                          <FaTrashAlt />
                        </Button>
                      </div>
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
              <Card className={styles.glassCard}>
                <div className={styles.avatarPreviewWrapper}>
                  <Form.Label className="fw-bold d-block">Imagen de Perfil</Form.Label>
                  <img src={settings.profile.avatarUrl || "https://via.placeholder.com/150"} alt="Avatar" className={styles.avatarImage} />
                  <Form.Control type="file" size="sm" onChange={(e) => handleImageUpload(e, 'avatar')} accept="image/*" />
                </div>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Bio</Form.Label>
                  <Form.Control as="textarea" rows={2} value={settings.profile.bio} onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, bio: e.target.value } })} />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold"><FaImage className="me-2" />Fondo Personalizado</Form.Label>
                  <Form.Control type="file" size="sm" onChange={(e) => handleImageUpload(e, 'bg')} accept="image/*" />
                </Form.Group>

                <Row className={styles.colorPickerGroup}>
                  <Col xs={4}>
                    <Form.Label className="fw-bold d-block small">Fondo</Form.Label>
                    <Form.Control type="color" className={styles.colorInputCustom} value={settings.theme.backgroundColor} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, backgroundColor: e.target.value } })} />
                  </Col>
                  <Col xs={4}>
                    <Form.Label className="fw-bold d-block small">Marco Perfil</Form.Label>
                    <Form.Control type="color" className={styles.colorInputCustom} value={settings.theme.buttonColor} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, buttonColor: e.target.value } })} />
                  </Col>
                  <Col xs={4}>
                    <Form.Label className="fw-bold d-block small">Texto</Form.Label>
                    <Form.Control type="color" className={styles.colorInputCustom} value={settings.theme.textColor} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, textColor: e.target.value } })} />
                  </Col>
                </Row>

                <Button variant="primary" className={`${styles.primaryBtn} w-100 shadow`} onClick={handleSaveSettings}>
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