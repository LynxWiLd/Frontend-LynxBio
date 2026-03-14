import { useState, useContext } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form"; // 👈 El motor de validaciones
import api from "../../services/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterModal = () => {
  const { showRegister, handleCloseModals, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [apiError, setApiError] = useState(null); // Para errores del backend
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuramos React Hook Form
  const {
    register,
    handleSubmit,
    watch, // Para observar cambios en el username en tiempo real
    formState: { errors },
    reset
  } = useForm({
    defaultValues: { username: "", email: "", password: "" }
  });

  // Observamos el campo username para el texto de ayuda
  const currentUsername = watch("username");

  const onSubmit = async (data) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      // 1. Registro
      await api.post("/auth/register", data);

      // 2. Login Automático
      try {
        await login(data.email, data.password);
        handleCloseModals();
        reset();
        navigate("/dashboard");

        Swal.fire({
          icon: "success",
          title: "¡Bienvenido a la manada!",
          text: "Tu cuenta de LynxBio está lista.",
          timer: 2500,
          showConfirmButton: false,
        });
      } catch (loginErr) {
        handleCloseModals();
        Swal.fire({
          icon: "info",
          title: "Cuenta creada",
          text: "Cuenta creada con éxito, por favor iniciá sesión manualmente.",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Hubo un problema al crear tu cuenta.";
      setApiError(msg);
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

        {apiError && (
          <Alert variant="danger" className="py-2 small text-center">
            {apiError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          
          {/* USERNAME */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="ej: facu.dev"
              className="py-2"
              isInvalid={!!errors.username}
              {...register("username", { 
                required: "El nombre de usuario es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                pattern: {
                  value: /^[a-zA-Z0-9._-]+$/,
                  message: "Solo letras, números, puntos y guiones"
                }
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted small ps-1">
              Tu link será:{" "}
              <strong>
                lynxbio.vercel.app/{currentUsername || "usuario"}
              </strong>
            </Form.Text>
          </Form.Group>

          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="tu@email.com"
              className="py-2"
              isInvalid={!!errors.email}
              {...register("email", { 
                required: "El email es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Formato de email inválido"
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
              placeholder="Mínimo 6 caracteres"
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