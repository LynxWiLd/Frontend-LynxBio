import { useForm } from "react-hook-form";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaInstagram, FaGithub, FaImage, FaTrash, FaCheckCircle, FaUserCircle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 
import styles from "../../pages/Dashboard/Dashboard.module.css";

const AppearanceForm = ({
  settings,
  setSettings,
  handleImageUpload,
  handleRemoveImage, // 👈 Nueva prop
  handleSaveSettings,
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
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
      <h4 className="fw-bold mb-4 text-center">Personalización Técnica</h4>

      {/* --- FOTO DE PERFIL --- */}
      <div className="text-center mb-4">
        <Form.Label className="fw-bold d-block"><FaUserCircle className="me-2"/>Imagen de Perfil</Form.Label>
        <div className="position-relative d-inline-block">
            <img
            src={settings.profile.avatarUrl || "https://via.placeholder.com/150"}
            alt="Avatar"
            className={styles.avatarImage}
            />
            {settings.profile.avatarUrl && (
                <Button 
                    variant="danger" 
                    size="sm" 
                    className="position-absolute top-0 end-0 rounded-circle shadow-sm"
                    onClick={() => handleRemoveImage("avatar")}
                >
                    <FaTrash size={12}/>
                </Button>
            )}
        </div>
        <Form.Control
          type="file"
          size="sm"
          className="mt-2"
          onChange={(e) => handleImageUpload(e, "avatar")}
          accept="image/*"
        />
      </div>

      {/* --- FONDO PERSONALIZADO --- */}
      <div className="mb-4">
        <Form.Label className="fw-bold d-block"><FaImage className="me-2" /> Fondo de Pantalla</Form.Label>
        <InputGroup>
            <Form.Control
                type="file"
                size="sm"
                onChange={(e) => handleImageUpload(e, "background")}
                accept="image/*"
            />
            {settings.theme.backgroundImage && (
                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveImage("background")}>
                    <FaTrash />
                </Button>
            )}
        </InputGroup>
      </div>

      {/* --- PALETA DE COLORES --- */}
      <hr />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0 text-primary">Paleta de Colores</h5>
        <Button 
            variant="success" 
            size="sm" 
            className="rounded-pill px-3 fw-bold shadow-sm"
            onClick={handleSaveSettings}
        >
            <FaCheckCircle className="me-1"/> Aplicar Colores
        </Button>
      </div>
      
      <Row className="text-center mb-4">
        {[
          { label: "Fondo", key: "backgroundColor" },
          { label: "Borde Foto", key: "buttonColor" },
          { label: "Texto", key: "textColor" }
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

      {/* --- BIO Y REDES (Resto igual) --- */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Bio</Form.Label>
        <Form.Control
          as="textarea"
          className={styles.bioTextArea}
          {...register("bio", {
            maxLength: 150,
            onChange: (e) => setSettings(prev => ({...prev, profile: {...prev.profile, bio: e.target.value}}))
          })}
        />
        <div className={styles.charCounter}>{bioWatch?.length || 0} / 150</div>
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 rounded-pill fw-bold py-2 shadow">
        GUARDAR CAMBIOS GENERALES
      </Button>
    </Form>
  );
};

export default AppearanceForm;