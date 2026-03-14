import { useState, useContext } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const RegisterModal = ({ show, handleClose }) => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // 1. Llamamos al endpoint de registro
      const res = await api.post('/auth/register', formData);
      
      // 2. Si el registro es exitoso, el backend nos devuelve el token
      // Usamos la función login del contexto para guardar todo y entrar
      login(res.data); 
      handleClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al crear la cuenta');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crea tu cuenta en LynxBio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de usuario (será tu link)</Form.Label>
            <Form.Control 
              type="text" 
              name="username"
              placeholder="ej: facu-dev" 
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email"
              placeholder="tu@email.com" 
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              name="password"
              placeholder="Mínimo 6 caracteres" 
              onChange={handleChange}
              required 
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="success" type="submit">
              Registrarme gratis
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;