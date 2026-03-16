import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaPalette, FaLink, FaUserCheck } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./HomePage.module.css"; 

const HomePage = () => {
  const { user, handleOpenRegister, handleOpenLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirigir al dashboard si el usuario ya está logueado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className={styles.pageWrapper}>
      {/* --- HERO SECTION --- */}
      <section className={styles.heroSection}>
        {/* Fondos decorativos dinámicos */}
        <div className={styles.connectionBackground} />
        <div className={styles.connectionBackgroundOverlay} />

        <Container className={styles.heroContent}>
          <Row className="justify-content-center text-center">
            <Col md={10} lg={8}>
              <h1 className={`display-3 fw-bold mb-3 ${styles.title}`}>
                ¡Bienvenido a LynxBio! <br />
                Tu mundo, un link.
              </h1>
              <p className={`lead fs-3 mb-5 ${styles.subtitle}`}>
                La forma más simple y facha de organizar y compartir todos tus links.
              </p>

              <div className="d-flex gap-3 justify-content-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOpenRegister}
                  className={`px-5 py-3 fw-bold rounded-pill shadow border-0 ${styles.primaryBtn}`}
                >
                  <FaRocket className="me-2" /> Empezar Gratis
                </Button>

                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={handleOpenLogin}
                  className={`px-5 py-3 fw-bold rounded-pill shadow-sm ${styles.secondaryBtn}`}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- FEATURES SECTION --- */}
      <Container className={`py-5 ${styles.featuresSection}`}>
        <Row className="justify-content-center text-center mb-5">
          <Col md={8}>
            <h2 className={`display-5 fw-bold ${styles.sectionTitle}`}>
              Todos tus enlaces importantes en un solo lugar facha.
            </h2>
          </Col>
        </Row>

        <Row className="justify-content-center text-center mb-4">
          <Col md={8}>
            <h3 className={`h1 fw-bold mb-4 ${styles.sectionTitle}`}>¿Cómo funciona?</h3>
          </Col>
        </Row>

        <Row className="g-4 text-center">
          {[
            { 
              icon: <FaUserCheck size={40} />, 
              text: "Registrate en segundos." 
            },
            { 
              icon: <FaPalette size={40} />, 
              text: "Personalizá tu perfil." 
            },
            { 
              icon: <FaLink size={40} />, 
              text: "Cargá tus links." 
            },
            { 
              icon: <FaRocket size={40} />, 
              text: "Compartí tu URL." 
            },
          ].map((step, index) => (
            <Col key={index} xs={12} sm={6} lg={3}>
              <Card className={`h-100 border-0 p-4 shadow ${styles.stepCard}`}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <div className={`mb-4 ${styles.iconWrapper}`}>
                    {step.icon}
                  </div>
                  <Card.Text className="h4 fw-bold">{step.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;