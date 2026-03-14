import { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // 1. Importamos el hook de navegación
import Swal from "sweetalert2";

const LoginModal = () => {
  const { showLogin, handleCloseModals, handleOpenRegister, login } = useContext(AuthContext);
  
  const navigate = useNavigate(); // 2. Inicializamos el navegador
  
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Intentamos el login a través del contexto
      await login(formData.email, formData.password);
      
      // --- SI EL LOGIN ES EXITOSO: ---
      handleCloseModals(); // 3. Cerramos la ventana modal
      
      navigate("/dashboard"); // 4. Redirigimos al Panel de Control
      
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      const msg = err.response?.data?.msg || "Credenciales incorrectas";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <Modal show={showLogin} onHide={handleCloseModals} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold w-100 text-center">Iniciá Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="tu@email.com"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Tu contraseña"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" className="w-100 py-2 mb-3 rounded-pill fw-bold shadow-sm" type="submit">
            Entrar a LynxBio
          </Button>

          <p className="text-center mb-0 text-muted">
            ¿No tenés cuenta?{" "}
            <Button variant="link" className="p-0 fw-bold text-decoration-none" onClick={handleOpenRegister}>
              Registrate
            </Button>
          </p>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;