import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaRocket,
  FaPalette,
  FaLink,
  FaLayerGroup,
  FaMagic,
} from "react-icons/fa";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const { user, handleOpenRegister, handleOpenLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className={styles.pageWrapper}>
      {/* 🪄 ELEMENTOS DE FONDO (Blobs) */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      {/* --- HERO SECTION --- */}
      <section className={styles.heroSection}>
        <Container>
          <Row className="justify-content-center text-center py-5">
            <Col md={10} lg={8} className="mt-5">
              <h1 className={`display-2 fw-extrabold mb-3 ${styles.mainTitle}`}>
                Tu rastro online, <br />
                <span className={styles.gradientText}>en un solo lugar.</span>
              </h1>
              <p className={`lead fs-3 mb-5 ${styles.heroSubtitle}`}>
                La herramienta para creadores que buscan estética, velocidad y
                un control total sobre su marca personal.
              </p>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOpenRegister}
                  className={`px-5 py-3 fw-bold rounded-pill border-0 ${styles.ctaBtn}`}
                >
                  <FaRocket className="me-2" /> Empezar mi rastro
                </Button>

                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={handleOpenLogin}
                  className={`px-5 py-3 fw-bold rounded-pill ${styles.secondaryBtn}`}
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
            <h2 className={`display-4 fw-bold mb-3 ${styles.sectionTitle}`}>
              Potencia tu rastro digital
            </h2>
            {/* 🪄 AGREGAMOS LA CLASE AQUÍ */}
            <p className={`fs-5 ${styles.sectionSubtitle}`}>
              Tira el primero y hace que todos lo sigan.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {[
            {
              icon: <FaPalette />,
              title: "Personalización Total",
              desc: "Colores, gradientes y fuentes a tu medida.",
            },
            {
              icon: <FaMagic />,
              title: "Modo Glassmorphism",
              desc: "Efectos de cristal esmerilado premium.",
            },
            {
              icon: <FaLayerGroup />,
              title: "Gestión de Links",
              desc: "Ordená tus enlaces con Drag & Drop intuitivo.",
            },
          ].map((f, i) => (
            <Col md={4} key={i}>
              {/* 🪄 Usamos featureCard para que coincida con el CSS optimizado */}
              <Card className={`h-100 border-0 p-4 ${styles.featureCard}`}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <h4 className="fw-bold">{f.title}</h4>
                  <p className="small mb-0">{f.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* --- TEMPLATES PREVIEW --- */}
      <section className={styles.templatesTeaser}>
        <Container className="text-center">
          <div className={styles.glassBanner}>
            <h3 className="fw-bold h2 mb-3">
              🎨 Próximamente: Galería de Plantillas
            </h3>
            <p className="mb-0">
              Estamos diseñando estilos predefinidos para que lances tu rastro
              en un click.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
