import { useContext, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form"; // 👈 La estrella del show
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginModal = () => {
  const { showLogin, handleCloseModals, handleOpenRegister, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuramos el hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Esta función solo se ejecuta si las validaciones pasan
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      
      handleCloseModals();
      reset(); // Limpia el formulario
      navigate("/dashboard");
      
      Swal.fire({
        icon: "success",
        title: "¡De vuelta al ruedo!",
        text: "Iniciaste sesión correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      const msg = err.response?.data?.msg || "Credenciales incorrectas.";
      Swal.fire({ 
        icon: "error", 
        title: "Ups...", 
        text: msg,
        confirmButtonColor: "#007bff"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={showLogin} onHide={handleCloseModals} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold w-100 text-center fs-2">Iniciá Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <p className="text-center text-muted mb-4">¡Qué bueno verte de nuevo en LynxBio!</p>
        
        {/* El handleSubmit de la librería envuelve a nuestro onSubmit */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          
          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="nombre@ejemplo.com"
              className="py-2"
              isInvalid={!!errors.email} // Se pone rojo si hay error
              {...register("email", { 
                required: "El email es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email no válido"
                }
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* PASSWORD */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Tu contraseña secreta"
              className="py-2"
              isInvalid={!!errors.password}
              {...register("password", { 
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" }
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button 
            variant="primary" 
            className="w-100 py-2 mb-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center" 
            type="submit"
            disabled={isSubmitting}
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