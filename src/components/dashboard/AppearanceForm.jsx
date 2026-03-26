import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Row, Col, InputGroup, OverlayTrigger, Popover } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import {
  FaImage,
  FaTrash,
  FaCheckCircle,
  FaUserCircle,
  FaInfoCircle,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ICON_MAP } from "../../constants/iconMap";
import styles from "./AppearanceForm.module.css"; 

const DEFAULT_AVATAR = "https://res.cloudinary.com/dqlm5tnhk/image/upload/v1773873679/IconProfile_hoxpyj.svg";

const AppearanceForm = ({
  settings,
  setSettings,
  handleImageUpload,
  handleRemoveImage,
  handleSaveSettings,
}) => {
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (settings) {
      reset({
        bio: settings.profile.bio,
        instagram: settings.socials.instagram,
        github: settings.socials.github,
        twitter: settings.socials.twitter,
      });
    }
  }, [settings, reset]);

  const bioWatch = watch("bio") || "";

  // 🪄 Helper para limpiar redes sociales
  const cleanSocialInput = (name, value) => {
    const cleaned = value.split('/').pop().replace('@', '');
    setValue(name, cleaned); // Actualiza el input visualmente
    setSettings(prev => ({ 
      ...prev, 
      socials: { ...prev.socials, [name]: cleaned } 
    }));
  };

  const ColorPickerSelector = ({ label, itemKey }) => (
    <Col xs={4} className="d-flex flex-column align-items-center">
      <Form.Label className="small fw-bold mb-2 text-truncate w-100 text-center">{label}</Form.Label>
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="top"
        overlay={
          <Popover className={styles.colorPopover}>
            <Popover.Body className="d-flex flex-column align-items-center p-3">
              <HexColorPicker 
                color={settings.theme[itemKey] || "#000000"} 
                onChange={(newColor) => {
                  setSettings(prev => ({
                    ...prev,
                    theme: { ...prev.theme, [itemKey]: newColor }
                  }));
                }} 
              />
              <div className={styles.hexBadge}>
                {settings.theme[itemKey]?.toUpperCase()}
              </div>
            </Popover.Body>
          </Popover>
        }
      >
        <div 
          className={styles.colorPickerCircle} 
          style={{ backgroundColor: settings.theme[itemKey] }}
        />
      </OverlayTrigger>
    </Col>
  );

  return (
    <Form onSubmit={handleSubmit(handleSaveSettings)} className={styles.appearanceWrapper}>
      <h4 className={styles.formTitle}>🎨 Identidad Visual</h4>

      {/* --- FOTO DE PERFIL --- */}
      <section className={styles.formSection}>
        <Form.Label className="fw-bold d-block mb-3 text-center">
          <FaUserCircle className="me-2 text-primary" /> Imagen de Perfil
        </Form.Label>
        
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarContainer}>
            <img
              src={settings.profile.avatarUrl || DEFAULT_AVATAR}
              alt="Avatar"
              className={styles.avatarImage}
              style={{ borderColor: settings.theme.buttonColor }}
            />
            {settings.profile.avatarUrl && settings.profile.avatarUrl !== DEFAULT_AVATAR && (
              <button
                type="button"
                className={styles.removeAvatarBtn}
                onClick={() => handleRemoveImage("avatar")}
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-3">
          <label htmlFor="avatar-upload" className={styles.uploadBtn}>
            <FaCloudUploadAlt className="me-2" /> Cambiar Avatar
          </label>
          <input id="avatar-upload" type="file" hidden onChange={(e) => handleImageUpload(e, "avatar")} accept="image/*" />
        </div>
      </section>

      {/* --- BANNER --- */}
      <section className={styles.formSection}>
        <Form.Label className="fw-bold d-block mb-2 text-center">
          <FaImage className="me-2 text-primary" /> Fondo de Pantalla (Banner)
        </Form.Label>
        <div className={styles.fileInputWrapper}>
          <Form.Control 
            type="file" 
            className={styles.customFileInput}
            onChange={(e) => handleImageUpload(e, "background")} 
            accept="image/*" 
          />
          {settings.theme.backgroundImage && (
            <Button variant="danger" className="ms-2" onClick={() => handleRemoveImage("background")}>
              <FaTrash />
            </Button>
          )}
        </div>
      </section>

      {/* --- PALETA --- */}
      <section className={styles.formSection}>
        <h5 className="fw-bold mb-4 text-primary text-center">Paleta de Colores</h5>
        <Row className="text-center g-3">
          <ColorPickerSelector label="Fondo" itemKey="backgroundColor" />
          <ColorPickerSelector label="Botón" itemKey="buttonColor" />
          <ColorPickerSelector label="Texto" itemKey="textColor" />
        </Row>
      </section>

      {/* --- BIO --- */}
      <section className={styles.formSection}>
        <Form.Label className="fw-bold"><FaInfoCircle className="me-2 text-primary" /> Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          className={styles.bioTextArea}
          placeholder="Escribí algo que te defina..."
          {...register("bio", {
            maxLength: 150,
            onChange: (e) => setSettings(prev => ({ ...prev, profile: { ...prev.profile, bio: e.target.value } })),
          })}
        />
        <div className={`${styles.charCounter} ${bioWatch.length >= 150 ? styles.limitReached : ''}`}>
          {bioWatch.length} / 150
        </div>
      </section>

      {/* --- REDES --- */}
      <section className={styles.formSection}>
        <h5 className="fw-bold mb-3 text-center">Conexiones Sociales</h5>
        <Row className="g-3">
          {["instagram", "twitter", "github"].map((social) => {
            const SocialIcon = ICON_MAP[social] || ICON_MAP.web;
            return (
              <Col xs={12} key={social}>
                <InputGroup className={styles.socialInputGroup}>
                  <InputGroup.Text className={styles.socialIconAddon}>
                    <SocialIcon />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder={`Usuario de ${social}`}
                    {...register(social, {
                      onChange: (e) => cleanSocialInput(social, e.target.value)
                    })}
                  />
                </InputGroup>
              </Col>
            );
          })}
        </Row>
      </section>

      <Button variant="primary" type="submit" className={styles.submitBtn}>
        <FaCheckCircle className="me-2" /> GUARDAR MI IDENTIDAD
      </Button>
    </Form>
  );
};

export default AppearanceForm;