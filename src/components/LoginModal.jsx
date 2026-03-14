import { Modal, Button, Form } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginModal = () => {
  const { showLogin, handleCloseModals, handleOpenRegister } =
    useContext(AuthContext);

  return (
    <Modal show={showLogin} onHide={handleCloseModals} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold w-100 text-center">
          Iniciá Sesión
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="tu@email.com"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            className="w-100 py-2 mb-3 rounded-pill"
            type="submit"
          >
            Entrar
          </Button>
          <p className="text-center mb-0">
            ¿No tenés cuenta?{" "}
            <Button variant="link" className="p-0" onClick={handleOpenRegister}>
              Registrate
            </Button>
          </p>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
