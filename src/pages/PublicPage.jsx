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
        // 👇 AGREGÁ ESTE LOG para ver qué te devuelve el servidor exactamente
        console.log("Datos del perfil recibidos:", res.data);
        setUserData(res.data);
      } catch (err) {
        console.error("Perfil no encontrado o error de red");
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
        <p>Parece que este LynxBio no existe todavía.</p>
      </div>
    );

  const { profile = {}, theme = {}, links = [], socials = {} } = userData;

  const mainContainerStyle = {
    backgroundColor: theme?.backgroundColor || "#f8f9fa",
    backgroundImage: theme?.backgroundImage ? `url(${theme.backgroundImage})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    transition: "all 0.5s ease",
    position: "relative",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // El overlay solo se activa si hay una imagen de fondo
    backgroundColor: theme?.backgroundImage ? "rgba(0,0,0,0.4)" : "transparent",
    zIndex: 0,
  };

  const contentStyle = {
    position: "relative",
    zIndex: 1,
    maxWidth: "600px",
    color: theme?.textColor || "#000000",
  };

  return (
    <div style={mainContainerStyle}>
      <div style={overlayStyle} />

      <Container className="d-flex flex-column align-items-center py-5" style={contentStyle}>
        <Image
          src={profile?.avatarUrl || "https://via.placeholder.com/150"}
          roundedCircle
          className="mb-3 shadow border border-white border-4"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderColor: theme?.buttonColor || "#fff",
          }}
        />

        <h2 className="fw-bold mb-1" style={{ color: theme?.textColor || "#000" }}>
          @{username}
        </h2>
        <p className="text-center mb-4 fw-medium" style={{ color: theme?.textColor || "#000", opacity: 0.9 }}>
          {profile?.bio || "¡Bienvenido a mi página!"}
        </p>

        <div className="w-100 d-grid gap-3 mb-5">
          {/* Si no hay links, mostramos un mensaje amistoso */}
          {links.length > 0 ? (
            links.map((link) => (
              <Button
                key={link._id}
                href={link.url}
                target="_blank"
                className="py-3 shadow border-0 fw-bold transition-all"
                style={{
                  backgroundColor: theme?.buttonColor || "#000",
                  color: theme?.buttonTextColor || "#fff",
                  borderRadius: "16px",
                  fontSize: "1.1rem",
                }}
              >
                {link.title}
              </Button>
            ))
          ) : (
            <div className="text-center p-4 border rounded-3 bg-white bg-opacity-10">
              <p className="mb-0 small">Este usuario aún no ha agregado enlaces.</p>
            </div>
          )}
        </div>

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