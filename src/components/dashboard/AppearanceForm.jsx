import { useForm } from "react-hook-form";
import { Form, Button, Row, Col, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { HexColorPicker } from "react-colorful"; // 🪄 El gradiente pro
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

  // 🪄 Componente auxiliar para el selector de color con gradiente
  const ColorPickerSelector = ({ label, itemKey }) => (
    <Col xs={4} className="d-flex flex-column align-items-center">
      <Form.Label className="small fw-bold mb-2 text-truncate w-100">{label}</Form.Label>
      
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="top"
        overlay={
          <Popover className={styles.colorPopover}>
            <Popover.Body className="d-flex flex-column align-items-center">
              <HexColorPicker 
                color={settings.theme[itemKey]} 
                onChange={(newColor) => {
                  setSettings(prev => ({
                    ...prev,
                    theme: { ...prev.theme, [itemKey]: newColor }
                  }));
                }} 
              />
              <div className="mt-2 small fw-bold text-uppercase" style={{ color: 'var(--text-main)' }}>
                {settings.theme[itemKey]}
              </div>
            </Popover.Body>
          </Popover>
        }
      >
        <div 
          className={styles.colorPickerCircle} 
          style={{ backgroundColor: settings.theme[itemKey], cursor: 'pointer' }}
        />
      </OverlayTrigger>
    </Col>
  );

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
            {settings.profile.avatarUrl && settings.profile.avatarUrl !== DEFAULT_AVATAR && (
              <Button
                variant="danger"
                size="sm"
                className={styles.removeAvatarBtn}
                onClick={() => handleRemoveImage("avatar")}
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
          <input id="avatar-upload" type="file" hidden onChange={(e) => handleImageUpload(e, "avatar")} accept="image/*" />
        </div>
      </div>

      {/* --- FONDO --- */}
      <div className="mb-5">
        <Form.Label className="fw-bold d-block mb-2">
          <FaImage className="me-2" /> Fondo de Pantalla (Banner)
        </Form.Label>
        <InputGroup>
          <Form.Control type="file" size="sm" onChange={(e) => handleImageUpload(e, "background")} accept="image/*" />
          {settings.theme.backgroundImage && (
            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveImage("background")}><FaTrash /></Button>
          )}
        </InputGroup>
      </div>

      {/* --- PALETA DE COLORES (NUEVA LÓGICA) --- */}
      <hr className="my-4 opacity-25" />
      <h5 className="fw-bold mb-4 text-primary text-center">Paleta de Colores</h5>
      
      <Row className="text-center mb-4 g-3">
        <ColorPickerSelector label="Fondo App" itemKey="backgroundColor" />
        <ColorPickerSelector label="Borde/Botón" itemKey="buttonColor" />
        <ColorPickerSelector label="Texto Global" itemKey="textColor" />
      </Row>

      {/* --- BIO --- */}
      <hr className="my-4 opacity-25" />
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold"><FaInfoCircle className="me-2" /> Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          className={styles.bioTextArea}
          {...register("bio", {
            maxLength: 150,
            onChange: (e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, bio: e.target.value } })),
          })}
        />
        <div className={styles.charCounter}>{bioWatch?.length || 0} / 150</div>
      </Form.Group>

      {/* --- REDES --- */}
      <hr className="my-4 opacity-25" />
      <Row>
        {["instagram", "twitter", "github"].map((social) => {
          const SocialIcon = ICON_MAP[social] || ICON_MAP.web;
          return (
            <Col xs={12} md={4} key={social} className="mb-3">
              <Form.Label className="small fw-bold text-capitalize"><SocialIcon className="me-2 text-primary"/>{social}</Form.Label>
              <Form.Control
                type="text"
                {...register(social, {
                  onChange: (e) => setSettings(prev => ({ ...prev, socials: { ...prev.socials, [social]: e.target.value } })),
                })}
              />
            </Col>
          );
        })}
      </Row>

      <Button variant="primary" type="submit" className="w-100 rounded-pill fw-bold py-3 shadow mt-4">
        <FaCheckCircle className="me-2" /> GUARDAR TODO EL PERFIL
      </Button>
    </Form>
  );
};

export default AppearanceForm;