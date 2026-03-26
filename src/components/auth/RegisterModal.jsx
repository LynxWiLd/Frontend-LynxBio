import { useContext, useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "../../services/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./AuthModal.module.css"; // 👈 Usamos el mismo CSS del Login

const RegisterModal = () => {
  const { showRegister, handleCloseModals, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { username: "", email: "", password: "" },
  });

  const currentUsername = watch("username");

  const onSubmit = async (data) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      await api.post("/auth/register", data);

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
          background: "var(--bg-card)", // 👈 Adaptamos el Swal
          color: "var(--text-main)",
        });
      } catch (loginErr) {
        handleCloseModals();
        Swal.fire({
          icon: "info",
          title: "Cuenta creada",
          text: "Cuenta creada con éxito, por favor iniciá sesión manualmente.",
          background: "var(--bg-card)",
          color: "var(--text-main)",
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.msg || "Hubo un problema al crear tu cuenta.";
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={showRegister}
      onHide={handleCloseModals}
      centered
      contentClassName={styles.modalContent} // 👈 Mantiene el fondo oscuro/claro
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title
          className={`fw-bold w-100 text-center fs-2 ${styles.modalTitle}`}
        >
          Unite a LynxBio
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        <p className={`text-center mb-4 ${styles.modalSubtitle}`}>
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
            <Form.Label className={`fw-semibold ${styles.label}`}>
              Nombre de usuario
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="ej: facu.dev"
              className={styles.inputControl}
              isInvalid={!!errors.username}
              {...register("username", {
                required: "El nombre de usuario es obligatorio",
                validate: (value) => {
                  if (value.length < 3) return "Mínimo 3 caracteres";
                  if (value.length > 20) return "Máximo 20 caracteres";
                  if (!/^[a-zA-Z0-9._-]+$/.test(value))
                    return "Solo letras, números, puntos y guiones";
                  return true;
                },
                pattern: {
                  value: /^[a-zA-Z0-9._-]+$/,
                  message: "Solo letras, números, puntos y guiones",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username?.message}
            </Form.Control.Feedback>
            <Form.Text className={`${styles.modalSubtitle} small ps-1`}>
              Tu link será:{" "}
              <strong className="text-primary">
                lynxbio.vercel.app/{currentUsername || "usuario"}
              </strong>
            </Form.Text>
          </Form.Group>

          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label className={`fw-semibold ${styles.label}`}>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="tu@email.com"
              className={styles.inputControl}
              isInvalid={!!errors.email}
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Formato de email inválido",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* PASSWORD */}
          <Form.Group className="mb-4">
            <Form.Label className={`fw-semibold ${styles.label}`}>
              Contraseña
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Mínimo 6 caracteres"
              className={styles.inputControl}
              isInvalid={!!errors.password}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center border-0"
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
