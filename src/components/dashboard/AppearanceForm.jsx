import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { FaImage, FaSave } from 'react-icons/fa';
import styles from '../../pages/Dashboard/Dashboard.module.css';

const AppearanceForm = ({ settings, setSettings, handleImageUpload, handleSaveSettings }) => {
  return (
    <Card className={styles.glassCard}>
      {/* Sección Foto de Perfil */}
      <div className={styles.avatarPreviewWrapper}>
        <Form.Label className="fw-bold d-block">Imagen de Perfil</Form.Label>
        <img 
          src={settings.profile.avatarUrl || "https://via.placeholder.com/150"} 
          alt="Avatar" 
          className={styles.avatarImage} 
        />
        <Form.Control 
          type="file" 
          size="sm" 
          onChange={(e) => handleImageUpload(e, 'avatar')} 
          accept="image/*" 
        />
      </div>

      {/* Sección Biografía */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Bio</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={2} 
          value={settings.profile.bio} 
          onChange={(e) => setSettings({ 
            ...settings, 
            profile: { ...settings.profile, bio: e.target.value } 
          })} 
        />
      </Form.Group>

      {/* Sección Fondo Personalizado */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">
          <FaImage className="me-2" /> Fondo Personalizado
        </Form.Label>
        <Form.Control 
          type="file" 
          size="sm" 
          onChange={(e) => handleImageUpload(e, 'bg')} 
          accept="image/*" 
        />
        {settings.theme.backgroundImage && (
          <div className="mt-2 small text-success">✔ Imagen de fondo cargada</div>
        )}
      </Form.Group>

      {/* Selectores de Colores Globales */}
      <Row className={styles.colorPickerGroup}>
        <Col xs={4}>
          <Form.Label className="fw-bold d-block small">Fondo</Form.Label>
          <Form.Control 
            type="color" 
            className={styles.colorInputCustom} 
            value={settings.theme.backgroundColor} 
            onChange={(e) => setSettings({ 
              ...settings, 
              theme: { ...settings.theme, backgroundColor: e.target.value } 
            })} 
          />
        </Col>
        <Col xs={4}>
          <Form.Label className="fw-bold d-block small">Marco Foto</Form.Label>
          <Form.Control 
            type="color" 
            className={styles.colorInputCustom} 
            value={settings.theme.buttonColor} 
            onChange={(e) => setSettings({ 
              ...settings, 
              theme: { ...settings.theme, buttonColor: e.target.value } 
            })} 
          />
        </Col>
        <Col xs={4}>
          <Form.Label className="fw-bold d-block small">Texto</Form.Label>
          <Form.Control 
            type="color" 
            className={styles.colorInputCustom} 
            value={settings.theme.textColor} 
            onChange={(e) => setSettings({ 
              ...settings, 
              theme: { ...settings.theme, textColor: e.target.value } 
            })} 
          />
        </Col>
      </Row>

      <Button 
        variant="primary" 
        className={`${styles.primaryBtn} w-100 shadow mt-3`} 
        onClick={handleSaveSettings}
      >
        <FaSave className="me-2" /> GUARDAR TODO
      </Button>
    </Card>
  );
};

export default AppearanceForm;