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
  FaImage,
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../services/axiosConfig";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    buttonColor: "#000000",
    buttonTextColor: "#ffffff",
  });

  // Estado unificado: Agregamos backgroundImage y textColor
  const [settings, setSettings] = useState({
    profile: { bio: "", avatarUrl: "", username: "" },
    socials: { instagram: "", github: "", twitter: "" },
    theme: {
      backgroundColor: "#ffffff",
      backgroundImage: "", // <-- Nuevo
      buttonColor: "#000000",
      buttonTextColor: "#ffffff",
      textColor: "#000000", // <-- Nuevo
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
        theme: {
          backgroundColor: res.data.theme?.backgroundColor || "#ffffff",
          backgroundImage: res.data.theme?.backgroundImage || "",
          buttonColor: res.data.theme?.buttonColor || "#000000",
          buttonTextColor: res.data.theme?.buttonTextColor || "#ffffff",
          textColor: res.data.theme?.textColor || "#000000",
        },
      });
    } catch (err) {
      console.error("Error al cargar datos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/links", newLink);
      setLinks(res.data);
      // Reiniciamos con los colores por defecto
      setNewLink({
        title: "",
        url: "",
        buttonColor: "#000000",
        buttonTextColor: "#ffffff",
      });
      Swal.fire({
        icon: "success",
        title: "¡Link tematizado agregado!",
        timer: 1500,
        showConfirmButton: false,
      });
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

  const handleSaveSettings = async () => {
    try {
      await api.put("/auth/settings", settings);
      Swal.fire({
        icon: "success",
        title: "¡Todo guardado!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al guardar" });
    }
  };

  // Subida de Avatar
  const handleImageUpload = async (e) => {
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
      const res = await api.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSettings((prev) => ({
        ...prev,
        profile: { ...prev.profile, avatarUrl: res.data.url },
      }));
      Swal.fire({
        icon: "success",
        title: "¡Foto actualizada!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  };

  // --- NUEVA FUNCIÓN: Subida de imagen de FONDO ---
  const handleBgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      Swal.fire({
        title: "Subiendo fondo...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const res = await api.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSettings((prev) => ({
        ...prev,
        theme: { ...prev.theme, backgroundImage: res.data.url },
      }));
      Swal.fire({
        icon: "success",
        title: "¡Fondo actualizado!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo subir el fondo", "error");
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${settings.profile.username || ""}`;
    navigator.clipboard.writeText(url);
    Swal.fire({ icon: "info", title: "URL Copiada", timer: 2000 });
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Cargando LynxBio...</p>
      </Container>
    );

  return (
    <Container className="mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Control</h2>
        <Button variant="outline-dark" onClick={copyToClipboard}>
          <FaCopy className="me-2" /> Mi Link
        </Button>
      </div>

      <Tabs defaultActiveKey="links" className="mb-4">
        <Tab
          eventKey="links"
          title={
            <span>
              <FaLink className="me-2" />
              Enlaces
            </span>
          }
        >
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="mb-4 shadow-sm border-0 bg-light p-3">
                <Form onSubmit={handleAddLink}>
                  <Row className="g-2 mb-3">
                    <Col md={6}>
                      <Form.Control
                        placeholder="Título (ej: WhatsApp)"
                        value={newLink.title}
                        onChange={(e) =>
                          setNewLink({ ...newLink, title: e.target.value })
                        }
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        placeholder="URL (https://...)"
                        value={newLink.url}
                        onChange={(e) =>
                          setNewLink({ ...newLink, url: e.target.value })
                        }
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="g-2 align-items-center">
                    <Col xs={4}>
                      <Form.Label className="small fw-bold mb-0">
                        Color Botón
                      </Form.Label>
                      <Form.Control
                        type="color"
                        value={newLink.buttonColor}
                        onChange={(e) =>
                          setNewLink({
                            ...newLink,
                            buttonColor: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col xs={4}>
                      <Form.Label className="small fw-bold mb-0">
                        Color Texto
                      </Form.Label>
                      <Form.Control
                        type="color"
                        value={newLink.buttonTextColor}
                        onChange={(e) =>
                          setNewLink({
                            ...newLink,
                            buttonTextColor: e.target.value,
                          })
                        }
                      />
                    </Col>
                    <Col xs={4}>
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mt-3 fw-bold"
                      >
                        <FaPlus className="me-2" /> AGREGAR
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
              <ListGroup className="shadow-sm">
                {links.map((link) => (
                  <ListGroup.Item
                    key={link._id}
                    className="p-3 border-0 shadow-sm mb-2 rounded-4"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0 fw-bold">{link.title}</h6>
                        <small className="text-muted">{link.url}</small>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        {/* Muestra un circulito con el color elegido */}
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: link.buttonColor,
                            borderRadius: "50%",
                            border: "1px solid #ddd",
                          }}
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteLink(link._id)}
                        >
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

        <Tab
          eventKey="appearance"
          title={
            <span>
              <FaPalette className="me-2" />
              Apariencia
            </span>
          }
        >
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="shadow-sm border-0 p-4">
                {/* Foto de Perfil */}
                <div className="text-center mb-4">
                  <Form.Label className="fw-bold d-block">
                    Imagen de Perfil
                  </Form.Label>
                  <img
                    src={
                      settings.profile.avatarUrl ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Avatar"
                    className="rounded-circle mb-3 shadow"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <Form.Control
                    type="file"
                    size="sm"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>

                {/* Biografía */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={settings.profile.bio}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, bio: e.target.value },
                      })
                    }
                  />
                </Form.Group>

                {/* NUEVO: Imagen de Fondo */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    <FaImage className="me-2" />
                    Fondo Personalizado (Imagen)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    size="sm"
                    onChange={handleBgUpload}
                    accept="image/*"
                  />
                  {settings.theme.backgroundImage && (
                    <div className="mt-2 small text-success">
                      ✔ Imagen de fondo lista.
                    </div>
                  )}
                </Form.Group>

                {/* Redes Sociales */}
                <div className="mb-4">
                  <Form.Label className="fw-bold">Redes Sociales</Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <FaInstagram />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Instagram URL"
                      value={settings.socials.instagram}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socials: {
                            ...settings.socials,
                            instagram: e.target.value,
                          },
                        })
                      }
                    />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <FaGithub />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="GitHub URL"
                      value={settings.socials.github}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socials: {
                            ...settings.socials,
                            github: e.target.value,
                          },
                        })
                      }
                    />
                  </InputGroup>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <FaTwitter />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Twitter URL"
                      value={settings.socials.twitter}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socials: {
                            ...settings.socials,
                            twitter: e.target.value,
                          },
                        })
                      }
                    />
                  </InputGroup>
                </div>

                {/* Selector de Colores */}
                <Row className="mb-4 text-center">
                  <Col xs={4}>
                    <Form.Label className="fw-bold d-block small">
                      Fondo
                    </Form.Label>
                    <Form.Control
                      type="color"
                      className="mx-auto"
                      value={settings.theme.backgroundColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: {
                            ...settings.theme,
                            backgroundColor: e.target.value,
                          },
                        })
                      }
                    />
                  </Col>
                  <Col xs={4}>
                    {/* Cambiamos el texto de 'Botones' a 'Marco Perfil' */}
                    <Form.Label className="fw-bold d-block small">
                      Marco Perfil
                    </Form.Label>
                    <Form.Control
                      type="color"
                      className="mx-auto"
                      value={settings.theme.buttonColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: {
                            ...settings.theme,
                            buttonColor: e.target.value,
                          },
                        })
                      }
                    />
                  </Col>
                  <Col xs={4}>
                    <Form.Label className="fw-bold d-block small">
                      Texto
                    </Form.Label>
                    <Form.Control
                      type="color"
                      className="mx-auto"
                      value={settings.theme.textColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme: {
                            ...settings.theme,
                            textColor: e.target.value,
                          },
                        })
                      }
                    />
                  </Col>
                </Row>

                <Button
                  variant="primary"
                  className="w-100 fw-bold py-2 shadow"
                  onClick={handleSaveSettings}
                >
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
