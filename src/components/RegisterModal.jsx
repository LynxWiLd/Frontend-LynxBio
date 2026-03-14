import { useState, useContext } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const RegisterModal = () => {
  // 1. Consumimos todo del Contexto (ya no usamos props)
  const { showRegister, handleCloseModals, login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Registro en el Backend
      const res = await api.post("/auth/register", formData);

      // Si sale bien, usamos la función login del contexto para setear el token y user
      await login(formData.email, formData.password);

      handleCloseModals();

      Swal.fire({
        icon: "success",
        title: "¡Cuenta creada!",
        text: "Ya podés empezar a personalizar tu LynxBio",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Error al crear la cuenta");
    }
  };

  return (
    <Modal show={showRegister} onHide={handleCloseModals} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold w-100 text-center">
          Crea tu cuenta en LynxBio
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        {error && (
          <Alert variant="danger" className="py-2 small">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="ej: facu-dev"
              value={formData.username}
              onChange={handleChange}
              className="rounded-3"
              required
            />
            <Form.Text className="text-muted small">
              Este será tu link: lynxbio.vercel.app/
              {formData.username || "usuario"}
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
              className="rounded-3"
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
              className="rounded-3"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 rounded-pill fw-bold shadow-sm"
          >
            Registrarme gratis
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
