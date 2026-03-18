import { useForm } from "react-hook-form";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import {
  FaImage,
  FaTrash,
  FaCheckCircle,
  FaUserCircle,
  FaInfoCircle,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ICON_MAP } from "../../constants/iconMap";
import styles from "../../pages/Dashboard/Dashboard.module.css";

// 🪄 LA CONSTANTE MAESTRA
const DEFAULT_AVATAR = "https://res.cloudinary.com/dqlm5tnhk/image/upload/v1773873679/IconProfile_hoxpyj.svg";

const AppearanceForm = ({
  settings,
  setSettings,
  handleImageUpload,
  handleRemoveImage,
  handleSaveSettings,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      bio: settings.profile.bio,
      instagram: settings.socials.instagram,
      github: settings.socials.github,
      twitter: settings.socials.twitter,
    },
  });

  const bioWatch = watch("bio", settings.profile.bio);

  return (
    <Form onSubmit={handleSubmit(handleSaveSettings)} className={styles.glassCard}>
      <h4 className="fw-bold mb-4 text-center">Identidad Visual</h4>

      {/* --- FOTO DE PERFIL --- */}
      <div className="text-center mb-5">
        <Form.Label className="fw-bold d-block mb-3">
          <FaUserCircle className="me-2" /> Imagen de Perfil
        </Form.Label>
        
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarContainer}>
            <img
              src={settings.profile.avatarUrl || DEFAULT_AVATAR}
              alt="Avatar"
              className={styles.avatarImage}
            />
            {/* 🪄 SOLO mostramos el tachito si NO es la imagen default */}
            {settings.profile.avatarUrl && settings.profile.avatarUrl !== DEFAULT_AVATAR && (
              <Button
                variant="danger"
                size="sm"
                className={styles.removeAvatarBtn}
                onClick={() => handleRemoveImage("avatar")}
                title="Quitar foto y volver al default"
              >
                <FaTrash size={12} />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3">
          <label htmlFor="avatar-upload" className={`btn btn-outline-primary btn-sm rounded-pill px-4 ${styles.uploadLabel}`}>
            <FaCloudUploadAlt className="me-2" /> Subir nueva foto
          </label>
          <input
            id="avatar-upload"
            type="file"
            hidden
            onChange={(e) => handleImageUpload(e, "avatar")}
            accept="image/*"
          />
        </div>
      </div>

      {/* --- FONDO PERSONALIZADO --- */}
      <div className="mb-5">
        <Form.Label className="fw-bold d-block mb-2">
          <FaImage className="me-2" /> Fondo de Pantalla (Banner)
        </Form.Label>
        <InputGroup className={styles.customInputGroup}>
          <Form.Control
            type="file"
            size="sm"
            onChange={(e) => handleImageUpload(e, "background")}
            accept="image/*"
            className={styles.fileControl}
          />
          {settings.theme.backgroundImage && (
            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveImage("background")}>
              <FaTrash />
            </Button>
          )}
        </InputGroup>
        <Form.Text className="text-muted small">
          Se recomienda una imagen horizontal de buena calidad.
        </Form.Text>
      </div>

      {/* --- PALETA DE COLORES --- */}
      <hr className="my-4 opacity-25" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold m-0 text-primary">Paleta de Colores</h5>
      </div>

      <Row className="text-center mb-4 g-3">
        {[
          { label: "Fondo App", key: "backgroundColor" },
          { label: "Borde/Botón", key: "buttonColor" },
          { label: "Texto Global", key: "textColor" },
        ].map((item) => (
          <Col xs={4} key={item.key} className="d-flex flex-column align-items-center">
            <Form.Label className="small fw-bold mb-2 text-truncate w-100">{item.label}</Form.Label>
            <Form.Control
              type="color"
              className={styles.colorPickerCircle}
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

      {/* --- BIO --- */}
      <hr className="my-4 opacity-25" />
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">
          <FaInfoCircle className="me-2" /> Bio (Tu descripción)
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          className={styles.bioTextArea}
          placeholder="Ej: Junior Full-Stack Developer | Amante de los linces..."
          {...register("bio", {
            maxLength: 150,
            onChange: (e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, bio: e.target.value } })),
          })}
        />
        <div className={`${styles.charCounter} ${bioWatch?.length >= 150 ? styles.charCounterError : ""}`}>
          {bioWatch?.length || 0} / 150
        </div>
      </Form.Group>

      {/* --- REDES SOCIALES --- */}
      <hr className="my-4 opacity-25" />
      <h5 className="fw-bold mb-3">Conexiones Sociales</h5>
      <Row>
        {["instagram", "twitter", "github"].map((social) => {
          const SocialIcon = ICON_MAP[social] || ICON_MAP.web;
          return (
            <Col xs={12} md={4} key={social} className="mb-3">
              <Form.Group>
                <Form.Label className="small fw-bold text-capitalize d-flex align-items-center">
                  <span className="me-2 d-flex align-items-center text-primary" style={{ fontSize: '1.2rem' }}>
                    <SocialIcon />
                  </span>
                  {social}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`@usuario`}
                  className={styles.socialInput}
                  {...register(social, {
                    onChange: (e) => setSettings(prev => ({ ...prev, socials: { ...prev.socials, [social]: e.target.value } })),
                  })}
                />
              </Form.Group>
            </Col>
          );
        })}
      </Row>

      <Button variant="primary" type="submit" className="w-100 rounded-pill fw-bold py-3 shadow mt-4 animate__animated animate__pulse animate__infinite animate__slow">
        <FaCheckCircle className="me-2" /> GUARDAR TODO EL PERFIL
      </Button>
    </Form>
  );
};

export default AppearanceForm;