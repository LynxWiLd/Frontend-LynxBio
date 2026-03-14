import { useForm } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import styles from "../../pages/Dashboard/Dashboard.module.css";

const AddLinkCard = ({ handleAddLink }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    handleAddLink(data); // Le pasamos los datos limpios al Dashboard
    reset(); // Limpiamos el formulario después de agregar
  };

  return (
    <div className={styles.glassCard}>
      <h5 className="fw-bold mb-3">Agregar Nuevo Enlace</h5>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label className="small fw-bold">
                Título del botón
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Mi Portfolio"
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
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label className="small fw-bold">URL (Link)</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://..."
                isInvalid={!!errors.url}
                {...register("url", {
                  required: "La URL es obligatoria",
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                    message: "URL no válida (ej: https://google.com)",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.url?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-2">
          <Col xs={6}>
            <Form.Label className="small fw-bold d-block">
              Color Botón
            </Form.Label>
            <Form.Control
              type="color"
              className={styles.colorInputCustom}
              defaultValue="#000000"
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
              defaultValue="#ffffff"
              {...register("buttonTextColor")}
            />
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mt-3 rounded-pill fw-bold"
        >
          + Agregar Enlace
        </Button>
      </Form>
    </div>
  );
};

export default AddLinkCard;
