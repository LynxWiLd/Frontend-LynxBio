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
} from "react-bootstrap";
import { Trash2, ExternalLink, Plus } from "lucide-react";
import api from "../api/axios";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [settings, setSettings] = useState({
    profile: { bio: '', avatarUrl: '' },
    theme: { backgroundColor: '#ffffff', buttonColor: '#000000', buttonTextColor: '#ffffff' }
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/links'); // O un nuevo endpoint que traiga todo el user
      // Para simplificar, supongamos que el login ya nos dio estos datos o hacemos un GET /auth/me
      const userRes = await api.get('/auth/profile/me'); // Necesitarías crear este endpoint
      setLinks(userRes.data.links);
      setSettings({ profile: userRes.data.profile, theme: userRes.data.theme });
    } catch (err) { console.error(err); }
  };

  const handleSaveSettings = async () => {
    try {
      await api.put('/auth/settings', settings);
      alert('¡Configuración guardada!');
    } catch (err) { alert('Error al guardar'); }
  };

  return (
    <Container className="mt-4">
      <Tabs defaultActiveKey="links" className="mb-4">
        <Tab eventKey="links" title="Mis Enlaces">
          {/* Aquí va todo el código de links que ya teníamos */}
        </Tab>

        <Tab eventKey="appearance" title="Apariencia">
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="shadow-sm p-4">
                <h4 className="mb-4">Personaliza tu página</h4>
                
                <Form.Group className="mb-3">
                  <Form.Label>Bio / Descripción</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    value={settings.profile.bio}
                    onChange={(e) => setSettings({
                      ...settings, 
                      profile: { ...settings.profile, bio: e.target.value }
                    })}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Fondo</Form.Label>
                      <Form.Control 
                        type="color" 
                        value={settings.theme.backgroundColor}
                        onChange={(e) => setSettings({
                          ...settings, 
                          theme: { ...settings.theme, backgroundColor: e.target.value }
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Botones</Form.Label>
                      <Form.Control 
                        type="color" 
                        value={settings.theme.buttonColor}
                        onChange={(e) => setSettings({
                          ...settings, 
                          theme: { ...settings.theme, buttonColor: e.target.value }
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" className="mt-3" onClick={handleSaveSettings}>
                  Guardar Cambios
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
