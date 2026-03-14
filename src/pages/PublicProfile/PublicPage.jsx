import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Image, Button } from "react-bootstrap";
import { FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";
import api from "../../services/axiosConfig";
import styles from "./PublicPage.module.css";

const PublicPage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // IMPORTANTE: Verificá si tu ruta de backend es /profile/ o /user/
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

  if (loading) return (
    <div className={styles.loaderWrapper}>
      <Spinner animation="border" variant="light" />
    </div>
  );

  if (!userData) return <div className="text-center mt-5 text-white"><h1>404</h1><p>No se encontró el rastro del lince.</p></div>;

  const { profile = {}, theme = {}, links = [], socials = {} } = userData;

  return (
    <div 
      className={styles.publicPageWrapper} 
      style={{ 
        backgroundColor: theme?.backgroundColor || "#121212",
        backgroundImage: theme?.backgroundImage ? `url(${theme.backgroundImage})` : "none" 
      }}
    >
      {/* El overlay oscuro para que el fondo no pise el contenido */}
      {theme?.backgroundImage && <div className={styles.overlay} />}

      <div className={styles.glassCard} style={{ color: theme?.textColor || "#fff" }}>
        <Image
          src={profile?.avatarUrl || "https://via.placeholder.com/150"}
          roundedCircle
          className={styles.avatar}
          style={{ borderColor: theme?.buttonColor || "#fff" }}
        />
        
        <h2 className="fw-bold mb-1">@{username}</h2>
        <p className="mb-4 fw-medium" style={{ opacity: 0.8 }}>
          {profile?.bio}
        </p>

        <div className="w-100 d-grid gap-3 mb-5">
          {links.map((link) => (
            <Button
              key={link._id}
              href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank"
              className={styles.linkButton}
              style={{
                backgroundColor: link.buttonColor || "#000",
                color: link.buttonTextColor || "#fff",
                backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1))`,
              }}
            >
              {link.title}
            </Button>
          ))}
        </div>

        <div className={styles.socialIcons}>
          {socials?.instagram && (
            <a href={socials.instagram.startsWith("http") ? socials.instagram : `https://instagram.com/${socials.instagram}`} target="_blank" rel="noreferrer" style={{ color: theme?.textColor }}>
              <FaInstagram />
            </a>
          )}
          {socials?.github && (
            <a href={socials.github.startsWith("http") ? socials.github : `https://github.com/${socials.github}`} target="_blank" rel="noreferrer" style={{ color: theme?.textColor }}>
              <FaGithub />
            </a>
          )}
          {socials?.twitter && (
            <a href={socials.twitter.startsWith("http") ? socials.twitter : `https://twitter.com/${socials.twitter}`} target="_blank" rel="noreferrer" style={{ color: theme?.textColor }}>
              <FaTwitter />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicPage;