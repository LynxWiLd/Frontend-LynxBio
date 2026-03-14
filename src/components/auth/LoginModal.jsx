import { useState, useContext } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap"; // Agregamos Spinner
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginModal = () => {
  const { showLogin, handleCloseModals, handleOpenRegister, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // <--- Estado para el botón

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Bloqueamos el botón
    
    try {
      await login(formData.email, formData.password);
      
      handleCloseModals();
      navigate("/dashboard");
      
      Swal.fire({
        icon: "success",
        title: "¡De vuelta al ruedo!",
        text: "Iniciaste sesión correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (err) {
      const msg = err.response?.data?.msg || "Credenciales incorrectas. Revisá tu email o contraseña.";
      Swal.fire({ 
        icon: "error", 
        title: "Ups...", 
        text: msg,
        confirmButtonColor: "#007bff"
      });
    } finally {
      setIsSubmitting(false); // Desbloqueamos el botón (haya salido bien o mal)
    }
  };

  return (
    <Modal show={showLogin} onHide={handleCloseModals} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold w-100 text-center fs-2">Iniciá Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <p className="text-center text-muted mb-4">¡Qué bueno verte de nuevo en LynxBio!</p>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="nombre@ejemplo.com"
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
              placeholder="Tu contraseña secreta"
              onChange={handleChange}
              className="py-2"
              required
            />
          </Form.Group>

          <Button 
            variant="primary" 
            className="w-100 py-2 mb-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center" 
            type="submit"
            disabled={isSubmitting} // Deshabilitar mientras carga
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Entrando...
              </>
            ) : (
              "Entrar a LynxBio"
            )}
          </Button>

          <p className="text-center mb-0 text-muted">
            ¿No tenés cuenta?{" "}
            <Button 
              variant="link" 
              className="p-0 fw-bold text-decoration-none" 
              onClick={handleOpenRegister}
            >
              Registrate gratis
            </Button>
          </p>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;