import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { FaInstagram, FaGithub, FaXTwitter } from "react-icons/fa6";
import api from "../../services/axiosConfig";
import styles from "./PublicPage.module.css"; // 👈 Crearemos este archivo ahora

const PublicPage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/auth/user/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error("Usuario no encontrado");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  if (loading)
    return (
      <div className={styles.fullPageCenter}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-5">
        <h1>404</h1>
        <p>Usuario no encontrado</p>
      </div>
    );

  return (
    <div
      className={styles.publicWrapper}
      style={{
        backgroundColor: user.theme.backgroundColor,
        backgroundImage: user.theme.backgroundImage
          ? `url(${user.theme.backgroundImage})`
          : "none",
        color: user.theme.textColor,
      }}
    >
      <Container className={styles.mainContainer}>
        {/* Avatar */}
        <img
          src={user.profile.avatarUrl || "https://via.placeholder.com/150"}
          alt={user.username}
          className={styles.avatar}
          style={{ borderColor: user.theme.buttonColor }}
        />

        {/* Info */}
        <h1 className="fw-bold mt-3">@{user.username}</h1>
        <p className={styles.bio}>{user.profile.bio}</p>

        {/* Links */}
        <div className={styles.linksContainer}>
          {user.links.map((link) => (
            <a
              key={link._id}
              href={
                link.url.startsWith("http") ? link.url : `https://${link.url}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkButton}
              style={{
                backgroundColor: link.buttonColor || "#000",
                color: link.buttonTextColor || "#fff",
              }}
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Redes Sociales */}
        <div className={styles.socialIcons}>
          {user.socials?.instagram && (
            <a
              href={`https://instagram.com/${user.socials.instagram}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>
          )}
          {user.socials?.github && (
            <a
              href={`https://github.com/${user.socials.github}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
            </a>
          )}
          {user.socials?.twitter && (
            <a
              href={`https://twitter.com/${user.socials.twitter}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaXTwitter />
            </a>
          )}
        </div>

        {/* Branding LynxBio */}
        <footer className="mt-5 opacity-50 small">
          Creado con <strong>LynxBio</strong>
        </footer>
      </Container>
    </div>
  );
};

export default PublicPage;
