import { useForm } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import styles from "../../pages/Dashboard/Dashboard.module.css";

const AppearanceForm = ({
  settings,
  setSettings,
  handleImageUpload,
  handleSaveSettings,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange", // Valida mientras el usuario escribe
    defaultValues: {
      bio: settings.profile.bio,
      instagram: settings.socials.instagram,
      github: settings.socials.github,
      twitter: settings.socials.twitter,
    },
  });

  // Watch observa los cambios para el contador y el preview
  const bioWatch = watch("bio", settings.profile.bio);

  const onSubmit = () => {
    handleSaveSettings();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.glassCard}>
      <h4 className="fw-bold mb-4 text-center">Personalizá tu Perfil</h4>

      {/* SECCIÓN AVATAR */}
      <div className="text-center mb-4">
        <Form.Label className="fw-bold d-block">Imagen de Perfil</Form.Label>
        <img
          src={settings.profile.avatarUrl || "https://via.placeholder.com/150"}
          alt="Avatar Preview"
          className={styles.avatarImage}
        />
        <Form.Control
          type="file"
          size="sm"
          className="mt-2"
          onChange={(e) => handleImageUpload(e, "avatar")}
          accept="image/*"
        />
      </div>

      {/* BIO CON VALIDACIÓN Y SYNC */}
      <Form.Group className="mb-3 position-relative">
        <Form.Label className="fw-bold">Bio (Breve descripción)</Form.Label>
        <Form.Control
          as="textarea"
          className={styles.bioTextArea}
          placeholder="Contanos algo de vos..."
          isInvalid={!!errors.bio}
          {...register("bio", {
            maxLength: {
              value: 150,
              message: "¡Te pasaste! Máximo 150 caracteres.",
            },
            // El truco está acá: el onChange va dentro de register
            onChange: (e) => {
              setSettings((prev) => ({
                ...prev,
                profile: { ...prev.profile, bio: e.target.value },
              }));
            },
          })}
        />
        {/* Este es el mensaje de error que ahora sí va a aparecer */}
        <Form.Control.Feedback type="invalid" className="fw-bold">
          {errors.bio?.message}
        </Form.Control.Feedback>

        <div
          className={`${styles.charCounter} ${bioWatch?.length > 150 ? styles.charCounterError : ""}`}
        >
          {bioWatch?.length || 0} / 150
        </div>
      </Form.Group>

      {/* REDES SOCIALES */}
      <hr />
      <h5 className="fw-bold mb-3">Redes Sociales</h5>
      <Row>
        {["instagram", "twitter", "github"].map((social) => (
          <Col md={4} key={social} className="mb-3">
            <Form.Group>
              <Form.Label className="small fw-semibold text-capitalize">
                {social === "instagram" && <FaInstagram className="me-1" />}
                {social === "twitter" && <FaXTwitter className="me-1" />}
                {social === "github" && <FaGithub className="me-1" />} {social}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="usuario"
                {...register(social, {
                  onChange: (e) => {
                    setSettings((prev) => ({
                      ...prev,
                      socials: { ...prev.socials, [social]: e.target.value },
                    }));
                  },
                })}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>

      {/* PALETA DE COLORES */}
      <hr />
      <h5 className="fw-bold mb-3">Paleta de Colores</h5>
      <Row className="text-center">
        {[
          { label: "Fondo", key: "backgroundColor" },
          { label: "Marco Foto", key: "buttonColor" },
          { label: "Texto", key: "textColor" },
        ].map((item) => (
          <Col xs={4} key={item.key}>
            <Form.Label className="small fw-bold">{item.label}</Form.Label>
            <Form.Control
              type="color"
              className={styles.colorInputCustom}
              value={settings.theme[item.key]}
              onChange={(e) => {
                setSettings((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, [item.key]: e.target.value },
                }));
              }}
            />
          </Col>
        ))}
      </Row>

      <Button
        variant="primary"
        type="submit"
        className="w-100 mt-4 rounded-pill fw-bold py-2 shadow"
      >
        GUARDAR TODO
      </Button>
    </Form>
  );
};

export default AppearanceForm;
