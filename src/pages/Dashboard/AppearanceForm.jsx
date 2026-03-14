import { useForm } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // La X de Twitter
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

  // Observamos la bio para el contador de caracteres en tiempo real
  const bioWatch = watch("bio");

  // Esta función se ejecuta al darle al botón "Guardar"
  const onSubmit = (data) => {
    handleSaveSettings(); // Disparamos la función que ya tenés en el Dashboard
  };

  // Función para actualizar el preview mientras el usuario escribe
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si es un campo de redes sociales
    if (["instagram", "github", "twitter"].includes(name)) {
      setSettings({
        ...settings,
        socials: { ...settings.socials, [name]: value },
      });
    } else if (name === "bio") {
      setSettings({
        ...settings,
        profile: { ...settings.profile, bio: value },
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.glassCard}>
      <h4 className="fw-bold mb-4 text-center">Personalizá tu Perfil</h4>

      {/* --- SECCIÓN AVATAR --- */}
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
          onChange={(e) => handleImageUpload(e, "avatar")}
          accept="image/*"
        />
      </div>

      {/* --- BIO CON LÍMITES --- */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Bio (Breve descripción)</Form.Label>
        <Form.Control
          as="textarea"
          className={styles.bioTextArea}
          placeholder="Contanos algo de vos..."
          maxLength={150} // 👈 Esto corta el chorro a nivel teclado
          {...register("bio", {
            maxLength: { value: 150, message: "Máximo 150 caracteres" },
          })}
          onChange={(e) => {
            // Esto mantiene el preview sincronizado
            setSettings({
              ...settings,
              profile: { ...settings.profile, bio: e.target.value },
            });
          }}
        />
        <Form.Control.Feedback type="invalid">
          {errors.bio?.message}
        </Form.Control.Feedback>
        <div
          className={`${styles.charCounter} ${bioWatch?.length > 150 ? "text-danger fw-bold" : ""}`}
        >
          {bioWatch?.length || 0} / 150
        </div>
      </Form.Group>

      {/* --- REDES SOCIALES --- */}
      <hr />
      <h5 className="fw-bold mb-3">Redes Sociales</h5>
      <Row>
        <Col md={4} className="mb-2">
          <Form.Group>
            <Form.Label>
              <FaInstagram /> Instagram
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="usuario"
              {...register("instagram")}
              name="instagram"
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="mb-2">
          <Form.Group>
            <Form.Label>
              <FaXTwitter /> X (Twitter)
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="usuario"
              {...register("twitter")}
              name="twitter"
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="mb-2">
          <Form.Group>
            <Form.Label>
              <FaGithub /> GitHub
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="usuario"
              {...register("github")}
              name="github"
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* --- COLORES (ARTES VISUALES) --- */}
      <hr />
      <h5 className="fw-bold mb-3">Paleta de Colores</h5>
      <Row className="text-center">
        <Col xs={4}>
          <Form.Label className="small fw-bold">Fondo</Form.Label>
          <Form.Control
            type="color"
            className={styles.colorInputCustom}
            value={settings.theme.backgroundColor}
            onChange={(e) =>
              setSettings({
                ...settings,
                theme: { ...settings.theme, backgroundColor: e.target.value },
              })
            }
          />
        </Col>
        <Col xs={4}>
          <Form.Label className="small fw-bold">Marco Foto</Form.Label>
          <Form.Control
            type="color"
            className={styles.colorInputCustom}
            value={settings.theme.buttonColor}
            onChange={(e) =>
              setSettings({
                ...settings,
                theme: { ...settings.theme, buttonColor: e.target.value },
              })
            }
          />
        </Col>
        <Col xs={4}>
          <Form.Label className="small fw-bold">Texto</Form.Label>
          <Form.Control
            type="color"
            className={styles.colorInputCustom}
            value={settings.theme.textColor}
            onChange={(e) =>
              setSettings({
                ...settings,
                theme: { ...settings.theme, textColor: e.target.value },
              })
            }
          />
        </Col>
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
