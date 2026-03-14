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
    defaultValues: {
      bio: settings.profile.bio,
      instagram: settings.socials.instagram,
      github: settings.socials.github,
      twitter: settings.socials.twitter,
    },
  });

  const bioWatch = watch("bio", settings.profile.bio);

  const onSubmit = () => {
    handleSaveSettings();
  };

  // Función unificada para que el celu de la derecha se entere de los cambios
  const syncPreview = (name, value, category) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [name]: value },
    }));
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.glassCard}>
      <h4 className="fw-bold mb-4 text-center">Personalizá tu Perfil</h4>

      {/* --- AVATAR --- */}
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

      {/* --- BIO CON LÍMITES Y SYNC --- */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Bio (Breve descripción)</Form.Label>
        <Form.Control
          as="textarea"
          className={styles.bioTextArea}
          placeholder="Contanos algo de vos..."
          isInvalid={!!errors.bio}
          {...register("bio", {
            maxLength: { value: 150, message: "Máximo 150 caracteres" },
            onChange: (e) => syncPreview("bio", e.target.value, "profile"), // 👈 Sync correcto
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.bio?.message}
        </Form.Control.Feedback>
        <div
          className={`${styles.charCounter} ${bioWatch?.length >= 150 ? styles.charCounterError : ""}`}
        >
          {bioWatch?.length || 0} / 150
        </div>
      </Form.Group>

      {/* --- REDES SOCIALES --- */}
      <hr />
      <h5 className="fw-bold mb-3">Redes Sociales</h5>
      <Row>
        {["instagram", "twitter", "github"].map((social) => (
          <Col md={4} key={social} className="mb-2">
            <Form.Group>
              <Form.Label className="small fw-semibold">
                {social === "instagram" && <FaInstagram />}
                {social === "twitter" && <FaXTwitter />}
                {social === "github" && <FaGithub />} {social}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="usuario"
                {...register(social, {
                  onChange: (e) =>
                    syncPreview(social, e.target.value, "socials"),
                })}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>

      {/* --- COLORES --- */}
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
              onChange={(e) => syncPreview(item.key, e.target.value, "theme")}
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
