import { useState, useContext } from "react"; // 1. Agregamos useState
import { Modal, Button, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const LoginModal = () => {
  // Extraemos las funciones del contexto
  const { showLogin, handleCloseModals, handleOpenRegister, login } =
    useContext(AuthContext);

  // 2. Creamos el estado local para el formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 3. Definimos la función handleChange que faltaba
  const ArabhandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("1. Intentando enviar datos:", formData); // Paso 1

  try {
    if (!login) {
      console.error("ERROR: La función 'login' no existe en el contexto.");
      return;
    }

    await login(formData.email, formData.password);
    console.log("2. ¡Login exitoso en el context!"); // Paso 2

  } catch (err) {
    // 👇 ESTO ES CLAVE: Mostramos el error REAL en la consola
    console.error("ERROR REAL CAPTURADO:", err); 
    
    // Solo mostramos el Swal si el error viene del servidor (400)
    const mensaje = err.response?.data?.msg || "Error interno de código";
    Swal.fire({ icon: "error", title: "Ups!", text: mensaje });
  }
};

  return (
    <Modal show={showLogin} onHide={handleCloseModals} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold w-100 text-center">
          Iniciá Sesión
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email" // IMPORTANTE: debe coincidir con el campo en formData
              placeholder="tu@email.com"
              value={formData.email}
              onChange={ArabhandleChange} // <-- Ahora sí existe
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={ArabhandleChange} // <-- Ahora sí existe
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100 py-2 mb-3 rounded-pill fw-bold"
            type="submit"
          >
            Entrar
          </Button>

          <p className="text-center mb-0 text-muted">
            ¿No tenés cuenta?{" "}
            <Button
              variant="link"
              className="p-0 fw-bold text-decoration-none"
              onClick={handleOpenRegister}
            >
              Registrate
            </Button>
          </p>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
