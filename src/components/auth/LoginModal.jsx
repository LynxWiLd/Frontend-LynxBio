import { useContext, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./AuthModal.module.css"; // 👈 Importamos los nuevos estilos

const LoginModal = () => {
  const { showLogin, handleCloseModals, handleOpenRegister, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      handleCloseModals();
      reset();
      navigate("/dashboard");
      
      Swal.fire({
        icon: "success",
        title: "¡De vuelta al ruedo!",
        text: "Iniciaste sesión correctamente.",
        timer: 2000,
        showConfirmButton: false,
        background: 'var(--bg-card)', // 👈 Swal también se adapta
        color: 'var(--text-main)'
      });
    } catch (err) {
      const msg = err.response?.data?.msg || "Credenciales incorrectas.";
      Swal.fire({ 
        icon: "error", 
        title: "Ups...", 
        text: msg,
        confirmButtonColor: "#0d6efd",
        background: 'var(--bg-card)',
        color: 'var(--text-main)'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      show={showLogin} 
      onHide={handleCloseModals} 
      centered
      contentClassName={styles.modalContent} // 👈 Clave para el modo oscuro
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className={`fw-bold w-100 text-center fs-2 ${styles.modalTitle}`}>
          Iniciá Sesión
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        <p className={`text-center mb-4 ${styles.modalSubtitle}`}>
          ¡Qué bueno verte de nuevo en LynxBio!
        </p>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label className={`fw-semibold ${styles.label}`}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="nombre@ejemplo.com"
              className={styles.inputControl}
              isInvalid={!!errors.email}
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
            <Form.Label className={`fw-semibold ${styles.label}`}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Tu contraseña secreta"
              className={styles.inputControl}
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
            className="w-100 py-2 mb-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center border-0" 
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

          <p className={`text-center mb-0 ${styles.modalSubtitle}`}>
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