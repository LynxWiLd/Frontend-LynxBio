import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Image, Spinner } from "react-bootstrap";
import { FaInstagram, FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import api from "../api/axios";
import styles from "./PublicPage.module.css"; // 1. Importamos el CSS

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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!userData)
    return (
      <div className="text-center mt-5">
        <h1>404 - No encontrado</h1>
      </div>
    );

  const { profile = {}, theme = {}, links = [], socials = {} } = userData;

  // Solo guardamos lo dinámico aquí
  const dynamicWrapper = {
    backgroundColor: theme?.backgroundColor || "#f8f9fa",
    backgroundImage: theme?.backgroundImage
      ? `url(${theme.backgroundImage})`
      : "none",
  };

  return (
    <div className={styles.publicPageWrapper} style={dynamicWrapper}>
      {/* Overlay: solo si hay imagen de fondo */}
      {theme?.backgroundImage && (
        <div
          className={styles.overlay}
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        />
      )}

      <div
        className={styles.glassCard}
        style={{ color: theme?.textColor || "#000" }}
      >
        <Image
          src={profile?.avatarUrl || "https://via.placeholder.com/150"}
          roundedCircle
          className={styles.avatar}
          style={{ borderColor: theme?.buttonColor || "#fff" }}
        />

        <h2 className="fw-bold mb-1">@{username}</h2>
        <p className="mb-4 fw-medium" style={{ opacity: 0.9 }}>
          {profile?.bio}
        </p>

        <div className="w-100 d-grid gap-3 mb-5">
          {links.map((link) => (
            <Button
              key={link._id}
              href={link.url}
              target="_blank"
              className={styles.linkButton} // Tu clase de CSS Module
              style={{
                // 👇 ACÁ ESTÁ LA CLAVE: Usamos los colores específicos de cada link
                backgroundColor: link.buttonColor || "#000",
                color: link.buttonTextColor || "#fff",
                // Mantenemos el degradado que definimos en el CSS
                backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1))`,
              }}
            >
              {link.title}
            </Button>
          ))}
        </div>

        <div className={styles.socialIcons}>
          {socials?.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noreferrer"
              style={{ color: theme?.textColor }}
            >
              <FaInstagram />
            </a>
          )}
          {socials?.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              style={{ color: theme?.textColor }}
            >
              <FaGithub />
            </a>
          )}
          {socials?.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noreferrer"
              style={{ color: theme?.textColor }}
            >
              <FaTwitter />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicPage;
