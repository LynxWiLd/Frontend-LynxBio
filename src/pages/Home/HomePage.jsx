import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Sacamos Link porque ahora usamos Modales
import { FaRocket, FaPalette, FaLink, FaUserCheck } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const HomePage = () => {
  // 1. Traemos user y las funciones de los modales del contexto
  const { user, handleOpenRegister, handleOpenLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // 2. EFECTO DE REDIRECCIÓN: Si ya hay sesión, mandamos al dashboard al toque
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div style={styles.pageWrapper}>
      <Container className="d-flex flex-column align-items-center py-5">
        {/* HERO SECTION */}
        <div style={styles.heroSection}>
          <div style={styles.connectionBackground} />
          <div style={styles.connectionBackgroundOverlay} />

          <Row className="justify-content-center text-center">
            <Col md={10} lg={8}>
              <h1 className="display-3 fw-bold mb-3" style={styles.title}>
                ¡Bienvenido a LynxBio! <br />
                Tu mundo, un link.
              </h1>
              <p className="lead fs-3 mb-5 text-muted" style={styles.subtitle}>
                La forma más simple y facha de organizar y compartir todos tus
                links.
              </p>

              <div className="d-flex gap-3 justify-content-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOpenRegister}
                  className="px-5 py-3 fw-bold rounded-pill shadow border-0"
                  style={styles.primaryBtn}
                >
                  <FaRocket className="me-2" /> Empezar Gratis
                </Button>

                {/* 3. CAMBIO: Ahora este botón dispara el Modal de Login */}
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={handleOpenLogin}
                  className="px-5 py-3 fw-bold rounded-pill shadow-sm"
                  style={styles.secondaryBtn}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* FEATURES SECTION */}
        <Container className="py-5" style={styles.featuresSection}>
          <Row className="justify-content-center text-center mb-5">
            <Col md={8}>
              <h2 className="display-5 fw-bold" style={styles.featureTitle}>
                Todos tus enlaces importantes en un solo lugar facha.
              </h2>
            </Col>
          </Row>

          <Row className="justify-content-center text-center mb-4">
            <Col md={8}>
              <h3 className="h1 fw-bold mb-4" style={styles.howTitle}>
                ¿Cómo funciona?
              </h3>
            </Col>
          </Row>

          <Row className="g-4 text-center">
            {[
              {
                icon: <FaUserCheck size={50} />,
                text: "Registrate en segundos.",
              },
              { icon: <FaPalette size={50} />, text: "Personalizá tu perfil." },
              { icon: <FaLink size={50} />, text: "Cargá tus links." },
              { icon: <FaRocket size={50} />, text: "Compartí tu URL." },
            ].map((step, index) => (
              <Col key={index} xs={12} sm={6} lg={3}>
                <Card
                  className="h-100 border-0 shadow-lg text-center p-4 hover-up"
                  style={styles.stepCard}
                >
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <div
                      style={styles.iconWrapper}
                      className="mb-4 shadow border border-white border-4 rounded-circle bg-white text-primary"
                    >
                      {step.icon}
                    </div>
                    <Card.Text className="h4 fw-bold">{step.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Container>
    </div>
  );
};

// --- Estilos ---
const styles = {
  pageWrapper: {
    backgroundColor: "#fff",
    minHeight: "100vh",
    fontFamily: '"Poppins", sans-serif',
    overflowX: "hidden",
  },
  heroSection: {
    width: "100%",
    position: "relative",
    padding: "100px 0 150px 0",
    backgroundColor: "#f8f9fa",
  },
  title: {
    color: "#1a1a1a",
    letterSpacing: "-1.5px",
    lineHeight: "1.1",
  },
  subtitle: {
    color: "#6c757d",
    lineHeight: "1.4",
  },
  primaryBtn: {
    backgroundColor: "#0d6efd",
    transition: "transform 0.2s ease",
  },
  secondaryBtn: {
    borderColor: "#0d6efd",
    color: "#0d6efd",
    backgroundColor: "transparent",
  },
  featuresSection: {
    position: "relative",
    zIndex: 1,
  },
  featureTitle: {
    color: "#1a1a1a",
    letterSpacing: "-1px",
  },
  howTitle: {
    color: "#1a1a1a",
    letterSpacing: "-1px",
  },
  stepCard: {
    borderRadius: "25px",
    backgroundColor: "#fff",
  },
  iconWrapper: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  connectionBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `
      linear-gradient(45deg, transparent 45%, #0d6efd 50%, transparent 55%),
      linear-gradient(135deg, transparent 45%, #0d6efd 50%, transparent 55%),
      linear-gradient(to right, #0d6efd 1px, transparent 1px),
      linear-gradient(to bottom, #0d6efd 1px, transparent 1px)
    `,
    backgroundSize: "150px 150px, 150px 150px, 75px 75px, 75px 75px",
    backgroundPosition: "0 0",
    opacity: 0.05,
  },
  connectionBackgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 50% 50%, transparent 50%, #f8f9fa 100%)",
  },
};

export default HomePage;
