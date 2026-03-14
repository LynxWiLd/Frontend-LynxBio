import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Image, Spinner } from "react-bootstrap";
import { FaInstagram, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import api from "../api/axios";

const PublicPage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/auth/profile/${username}`);
        setUserData(res.data);
      } catch (err) {
        console.error("Perfil no encontrado");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!userData)
    return (
      <div className="text-center mt-5">
        <h1>404 - Usuario no encontrado</h1>
      </div>
    );

  const { profile = {}, theme = {}, links = [], socials = {} } = userData;

  // --- 1. Estilos del Contenedor Principal (SÓLO EL FONDO FIJO) ---
  const mainContainerStyle = {
    // Si no hay imagen, usamos el color de fondo elegido
    backgroundColor: theme?.backgroundColor || "#f8f9fa", 
    backgroundImage: theme?.backgroundImage ? `url(${theme.backgroundImage})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed", // Imagen de fondo fija al hacer scroll
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    // Agregamos padding para que en móvil no pegue a los bordes
    padding: "40px 15px", 
  };

  // --- 2. Overlay (Opcional): Capa oscura sobre la imagen para legibilidad ---
  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme?.backgroundImage ? "rgba(0,0,0,0.2)" : "transparent",
    zIndex: 0,
  };

  // --- 3. ESTILOS DE LA TARJETA "LIQUID GLASS" (Aquí está la magia) ---
  const glassCardStyle = {
    position: "relative",
    zIndex: 1,
    maxWidth: "500px", // Ancho máximo de la tarjeta
    margin: "0 auto", // Centrado horizontal
    color: theme?.textColor || "#000000",
    
    // --- Efecto Glassmorphism ---
    // Fondo semi-transparente (usamos blanco muy suave)
    background: "rgba(255, 255, 255, 0.1)", 
    // Desenfoque del fondo (frosted glass)
    backdropFilter: "blur(12px)", 
    // Prefijo para Safari
    WebkitBackdropFilter: "blur(12px)", 
    
    // --- Bordes y Sombras ---
    border: "1px solid rgba(255, 255, 255, 0.2)", // Borde suave
    borderRadius: "25px", // Bordes muy redondeados
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Sombra sutil para dar profundidad
    
    // --- Espaciado Interno ---
    padding: "40px 25px", 
  };

  return (
    <div style={mainContainerStyle}>
      <div style={overlayStyle} />

      {/* Contenedor de Bootstrap con los estilos de vidrio aplicados */}
      <Container className="d-flex flex-column align-items-center" style={glassCardStyle}>
        {/* Foto de Perfil */}
        <Image
          src={profile?.avatarUrl || "https://via.placeholder.com/150"}
          roundedCircle
          className="mb-3 shadow border border-4"
          style={{
            width: "110px", 
            height: "110px",
            objectFit: "cover",
            borderColor: theme?.buttonColor || "#fff", // Borde de la foto del color de los botones
          }}
        />

        {/* Info del Perfil */}
        <h2 className="fw-bold mb-1" style={{ color: theme?.textColor || "#000" }}>
          @{username}
        </h2>
        <p className="text-center mb-4 fw-medium" style={{ color: theme?.textColor || "#000", opacity: 0.9 }}>
          {profile?.bio || "¡Bienvenido a mi página!"}
        </p>

        {/* Botones de Enlaces (Siguen siendo sólidos) */}
        <div className="w-100 d-grid gap-3 mb-5">
          {links.length > 0 ? (
            links.map((link) => (
              <Button
                key={link._id}
                href={link.url}
                target="_blank"
                className="py-3 shadow-sm border-0 fw-bold transition-all"
                style={{
                  backgroundColor: theme?.buttonColor || "#000",
                  color: theme?.buttonTextColor || "#fff",
                  borderRadius: "15px", // Bordes redondeados facha
                  fontSize: "1.1rem",
                }}
              >
                {link.title}
              </Button>
            ))
          ) : (
            <p className="small opacity-50">No hay links para mostrar aún.</p>
          )}
        </div>

        {/* Iconos Sociales */}
        <div className="d-flex gap-4 fs-1">
          {socials?.instagram && (
            <a href={socials.instagram} target="_blank" rel="noreferrer" style={{ color: theme?.textColor || "#000" }}>
              <FaInstagram />
            </a>
          )}
          {socials?.github && (
            <a href={socials.github} target="_blank" rel="noreferrer" style={{ color: theme?.textColor || "#000" }}>
              <FaGithub />
            </a>
          )}
          {socials?.twitter && (
            <a href={socials.twitter} target="_blank" rel="noreferrer" style={{ color: theme?.textColor || "#000" }}>
              <FaTwitter />
            </a>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PublicPage;