import { useForm, Controller } from "react-hook-form";
import { Form, Button, Row, Col, OverlayTrigger, Popover } from "react-bootstrap";
import { HexColorPicker } from "react-colorful"; // 🪄 Gradiente Pro para consistencia
import { ICON_OPTIONS } from "../../constants/iconMap";
import styles from "../../pages/Dashboard/Dashboard.module.css";

const AddLinkCard = ({ handleAddLink }) => {
  const {
    register,
    handleSubmit,
    reset,
    control, // Necesario para manejar los colores con Controller
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      url: "",
      icon: "web",
      buttonColor: "#000000",
      buttonTextColor: "#ffffff",
    },
  });

  // Miramos los colores para el feedback visual en los circulitos
  const watchButtonColor = watch("buttonColor");
  const watchTextColor = watch("buttonTextColor");

  const onSubmit = (data) => {
    // 🛡️ SEGURIDAD & LIMPIEZA:
    const cleanedData = {
      ...data,
      title: data.title.trim(), // También limpiamos el título
      url: data.url.trim().toLowerCase() // URLs siempre en minúscula para evitar bugs
    };
    
    handleAddLink(cleanedData);
    reset(); // Limpia el formulario tras agregar
  };

  // 🪄 Componente interno para el Color Picker (para no repetir código)
  const ColorPickerPopover = ({ name, label, currentColor }) => (
    <Form.Group className="d-flex flex-column align-items-center">
      <Form.Label className="small fw-bold mb-2">{label}</Form.Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <OverlayTrigger
            trigger="click"
            rootClose
            placement="top"
            overlay={
              <Popover className={styles.colorPopover}>
                <Popover.Body>
                  <HexColorPicker color={field.value} onChange={field.onChange} />
                  <div className="text-center mt-2 small fw-bold" style={{color: 'var(--text-main)'}}>
                    {field.value.toUpperCase()}
                  </div>
                </Popover.Body>
              </Popover>
            }
          >
            <div 
              className={styles.colorPickerCircle} 
              style={{ backgroundColor: field.value, cursor: 'pointer' }}
            />
          </OverlayTrigger>
        )}
      />
    </Form.Group>
  );

  return (
    <div className={styles.glassCard}>
      <h5 className="fw-bold mb-4">✨ Agregar Nuevo Enlace</h5>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="g-3">
          {/* Título */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-bold text-primary">Título del botón</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Mi Portafolio"
                isInvalid={!!errors.title}
                {...register("title", {
                  required: "El título es necesario",
                  maxLength: { value: 35, message: "Máximo 35 caracteres" },
                  validate: (value) => value.trim().length > 0 || "No puede estar vacío"
                })}
              />
              <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* URL */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-bold text-primary">URL (Link)</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://tupagina.com"
                isInvalid={!!errors.url}
                {...register("url", {
                  required: "La URL es obligatoria",
                  pattern: {
                    value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                    message: "URL no válida (debe incluir http:// o https://)",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">{errors.url?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Icono */}
          <Col xs={12}>
            <Form.Group>
              <Form.Label className="small fw-bold">Elegí un Icono</Form.Label>
              <Form.Select {...register("icon")} className={styles.customSelect}>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Selectores de Color Gradiente */}
          <Col xs={6}>
            <ColorPickerPopover name="buttonColor" label="Color Botón" currentColor={watchButtonColor} />
          </Col>
          <Col xs={6}>
            <ColorPickerPopover name="buttonTextColor" label="Color Texto" currentColor={watchTextColor} />
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mt-4 rounded-pill fw-bold py-3 shadow-lg animate__animated animate__fadeInUp"
        >
          🚀 Agregar Enlace a mi rastro
        </Button>
      </Form>
    </div>
  );
};

export default AddLinkCard;