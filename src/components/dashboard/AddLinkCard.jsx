import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import styles from '../../../pages/Dashboard/Dashboard.module.css';

const AddLinkCard = ({ newLink, setNewLink, handleAddLink }) => (
  <Card className={`${styles.glassCard} mb-4 bg-light`}>
    <Form onSubmit={handleAddLink}>
      <Row className="g-2 mb-3">
        <Col md={6}>
          <Form.Control 
            placeholder="Título (ej: WhatsApp)" 
            value={newLink.title} 
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} 
            required 
          />
        </Col>
        <Col md={6}>
          <Form.Control 
            placeholder="URL (https://...)" 
            value={newLink.url} 
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} 
            required 
          />
        </Col>
      </Row>
      <Row className="g-2 align-items-center text-center">
        <Col xs={4}>
          <Form.Label className="small fw-bold">Color Botón</Form.Label>
          <Form.Control type="color" className={styles.colorInputCustom} value={newLink.buttonColor} onChange={(e) => setNewLink({ ...newLink, buttonColor: e.target.value })} />
        </Col>
        <Col xs={4}>
          <Form.Label className="small fw-bold">Color Texto</Form.Label>
          <Form.Control type="color" className={styles.colorInputCustom} value={newLink.buttonTextColor} onChange={(e) => setNewLink({ ...newLink, buttonTextColor: e.target.value })} />
        </Col>
        <Col xs={4}>
          <Button variant="primary" type="submit" className={`${styles.primaryBtn} w-100 mt-3`}>
            <FaPlus className="me-2" /> AGREGAR
          </Button>
        </Col>
      </Row>
    </Form>
  </Card>
);

export default AddLinkCard;