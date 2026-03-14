import { useState, useContext } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import api from "../../services/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Importamos para redirigir
import Swal from "sweetalert2";

const RegisterModal = () => {
  const { showRegister, handleCloseModals, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación básica antes de pegarle a la API
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Intentamos el registro en el backend
      await api.post("/auth/register", formData);

      // 2. Intentamos el login automático para que entre directo
      try {
        await login(formData.email, formData.password);

        handleCloseModals();
        navigate("/dashboard"); // Lo mandamos al panel

        Swal.fire({
          icon: "success",
          title: "¡Bienvenido a la manada!",
          text: "Tu cuenta de LynxBio está lista.",
          timer: 2500,
          showConfirmButton: false,
        });
      } catch (loginErr) {
        // Si el registro fue OK pero el login falló por algo raro
        handleCloseModals();
        Swal.fire({
          icon: "info",
          title: "Cuenta creada",
          text: "Tu cuenta se creó con éxito, por favor iniciá sesión manualmente.",
        });
      }
    } catch (err) {
      // Error de registro (ej: el usuario o email ya existen)
      const msg =
        err.response?.data?.msg || "Hubo un problema al crear tu cuenta.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={showRegister} onHide={handleCloseModals} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold w-100 text-center fs-2">
          Unite a LynxBio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <p className="text-center text-muted mb-4">
          Crea tu página de enlaces en un toque.
        </p>

        {error && (
          <Alert variant="danger" className="py-2 small text-center">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="ej: facu.dev"
              value={formData.username}
              onChange={handleChange}
              className="py-2"
              required
            />
            <Form.Text className="text-muted small ps-1">
              Tu link será:{" "}
              <strong>
                lynxbio.vercel.app/{formData.username || "usuario"}
              </strong>
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="py-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              className="py-2"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creando cuenta...
              </>
            ) : (
              "Registrarme gratis"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
