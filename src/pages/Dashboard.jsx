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
  Spinner
} from "react-bootstrap";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import api from "../api/axios";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [settings, setSettings] = useState({
    profile: { bio: "", avatarUrl: "" },
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
      setSettings({
        profile: res.data.profile || { bio: "", avatarUrl: "" },
        theme: res.data.theme || { backgroundColor: "#ffffff", buttonColor: "#000000", buttonTextColor: "#ffffff" },
      });
    } catch (err) {
      console.error("Error al cargar los datos del Dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Enlaces ---
  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/links", newLink);
      setLinks(res.data); // El backend devuelve la lista actualizada
      setNewLink({ title: "", url: "" });
    } catch (err) {
      alert("Error al agregar el link");
    }
  };

  const handleDeleteLink = async (id) => {
    if (window.confirm("¿Eliminar este enlace?")) {
      try {
        const res = await api.delete(`/links/${id}`);
        setLinks(res.data.links);
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  // --- Lógica de Configuración ---
  const handleSaveSettings = async () => {
    try {
      await api.put("/auth/settings", settings);
      alert("¡Configuración guardada!");
    } catch (err) {
      alert("Error al guardar la configuración");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando tu panel...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Tabs defaultActiveKey="links" className="mb-4">
        
        {/* PESTAÑA 1: GESTIÓN DE LINKS */}
        <Tab eventKey="links" title="Mis Enlaces">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="mb-4 shadow-sm p-3">
                <Card.Title>Agregar nuevo enlace</Card.Title>
                <Form onSubmit={handleAddLink}>
                  <Row className="g-2">
                    <Col md={5}>
                      <Form.Control
                        placeholder="Título (ej: Mi Instagram)"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Control
                        placeholder="URL (https://...)"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={2}>
                      <Button variant="success" type="submit" className="w-100">
                        <Plus size={20} />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>

              <ListGroup className="shadow-sm">
                {links.length === 0 && (
                  <ListGroup.Item className="text-center text-muted py-4">
                    Aún no tienes enlaces. ¡Agrega el primero!
                  </ListGroup.Item>
                )}
                {links.map((link) => (
                  <ListGroup.Item key={link._id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{link.title}</h6>
                      <small className="text-muted">{link.url}</small>
                    </div>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm" href={link.url} target="_blank">
                        <ExternalLink size={16} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLink(link._id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Tab>

        {/* PESTAÑA 2: APARIENCIA */}
        <Tab eventKey="appearance" title="Apariencia">
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="shadow-sm p-4">
                <h4 className="mb-4">Personaliza tu página</h4>
                <Form.Group className="mb-3">
                  <Form.Label>Bio / Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={settings.profile.bio}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, bio: e.target.value },
                      })
                    }
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Fondo</Form.Label>
                      <Form.Control
                        type="color"
                        value={settings.theme.backgroundColor}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, backgroundColor: e.target.value },
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Botones</Form.Label>
                      <Form.Control
                        type="color"
                        value={settings.theme.buttonColor}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, buttonColor: e.target.value },
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" className="mt-3 w-100" onClick={handleSaveSettings}>
                  Guardar Configuración
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