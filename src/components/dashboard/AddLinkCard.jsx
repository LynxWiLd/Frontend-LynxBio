import { useForm } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ICON_OPTIONS } from "../../constants/iconMap";
import styles from "../../pages/Dashboard/Dashboard.module.css";

const AddLinkCard = ({ handleAddLink }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      icon: "web",
      buttonColor: "#000000",
      buttonTextColor: "#ffffff",
    },
  });

  const onSubmit = (data) => {
    // 🪄 Limpiamos espacios en blanco accidentales antes de mandar al backend
    const cleanedData = {
      ...data,
      url: data.url.trim()
    };
    handleAddLink(cleanedData);
    reset();
  };

  return (
    <div className={styles.glassCard}>
      <h5 className="fw-bold mb-3">Agregar Nuevo Enlace</h5>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {/* Título del botón */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label className="small fw-bold">
                Título del botón
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Mi TikTok"
                isInvalid={!!errors.title}
                {...register("title", {
                  required: "El título es necesario",
                  maxLength: { value: 30, message: "Máximo 30 letras" },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* URL (Link) - AQUÍ ESTABA EL FIX 🪄 */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label className="small fw-bold">URL (Link)</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://www.tiktok.com/@usuario"
                isInvalid={!!errors.url}
                {...register("url", {
                  required: "La URL es obligatoria",
                  pattern: {
                    /* ✅ REGEX ACTUALIZADO: Acepta @, ?, &, -, etc. */
                    value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                    message: "URL no válida (ej: https://tiktok.com/@tuusuario)",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.url?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Selector de Iconos */}
          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label className="small fw-bold">Elegí un Icono</Form.Label>
              <Form.Select
                {...register("icon")}
                className={styles.customSelect} // Podés usar estilos del module
                style={{ borderRadius: "12px", minHeight: "45px" }}
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Selectores de Color */}
        <Row className="mt-2">
          <Col xs={6}>
            <Form.Label className="small fw-bold d-block">
              Color Botón
            </Form.Label>
            <Form.Control
              type="color"
              className={styles.colorInputCustom}
              {...register("buttonColor")}
            />
          </Col>
          <Col xs={6}>
            <Form.Label className="small fw-bold d-block">
              Color Texto
            </Form.Label>
            <Form.Control
              type="color"
              className={styles.colorInputCustom}
              {...register("buttonTextColor")}
            />
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mt-4 rounded-pill fw-bold py-2 shadow"
        >
          + Agregar Enlace
        </Button>
      </Form>
    </div>
  );
};

export default AddLinkCard;