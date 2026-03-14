import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Image, Spinner } from "react-bootstrap";
import { Instagram, Twitter, Github, Globe } from "lucide-react";
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
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  if (!userData)
    return (
      <div className="text-center mt-5">
        <h1>404 - Usuario no encontrado</h1>
      </div>
    );

  const { profile, theme, links, socials } = userData;

  return (
    <div
      style={{
        backgroundColor: theme.backgroundColor || "#f8f9fa",
        minHeight: "100vh",
        color: theme.buttonTextColor || "#000",
      }}
    >
      <Container
        className="d-flex flex-column align-items-center py-5"
        style={{ maxWidth: "600px" }}
      >
        {/* Foto y Bio */}
        <Image
          src={profile.avatarUrl || "https://via.placeholder.com/150"}
          roundedCircle
          className="mb-3 shadow"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
        <h2 className="fw-bold">@{username}</h2>
        <p className="text-center mb-4">
          {profile.bio || "¡Bienvenido a mi página!"}
        </p>

        {/* Links principales */}
        <div className="w-100 d-grid gap-3 mb-5">
          {links.map((link) => (
            <Button
              key={link._id}
              href={link.url}
              target="_blank"
              variant="light"
              className="py-3 shadow-sm fw-semibold"
              style={{
                backgroundColor: theme.buttonColor || "#fff",
                color: theme.buttonTextColor || "#000",
                borderRadius: "12px",
                border: "none",
              }}
            >
              {link.title}
            </Button>
          ))}
        </div>

        {/* Redes Sociales (Iconos) */}
        <div className="d-flex gap-4">
          {socials?.instagram && (
            <a href={socials.instagram} className="text-reset">
              <Instagram />
            </a>
          )}
          {socials?.twitter && (
            <a href={socials.twitter} className="text-reset">
              <Twitter />
            </a>
          )}
          {socials?.github && (
            <a href={socials.github} className="text-reset">
              <Github />
            </a>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PublicPage;
