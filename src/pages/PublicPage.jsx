import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Image, Spinner } from 'react-bootstrap';
import { FaInstagram, FaTwitter, FaGithub, FaGlobe } from 'react-icons/fa';
import api from '../api/axios';

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

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  if (!userData) return <div className="text-center mt-5"><h1>404 - Usuario no encontrado</h1></div>;

  // Desestructuración segura con valores por defecto
  const { profile = {}, theme = {}, links = [], socials = {} } = userData;

  return (
    <div style={{ 
      backgroundColor: theme?.backgroundColor || '#f8f9fa', 
      minHeight: '100vh',
      transition: 'background-color 0.5s ease'
    }}>
      <Container className="d-flex flex-column align-items-center py-5" style={{ maxWidth: '600px' }}>
        <Image 
          src={profile?.avatarUrl || 'https://via.placeholder.com/150'} 
          roundedCircle 
          className="mb-3 shadow border border-white border-4"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
        <h2 className="fw-bold" style={{ color: theme?.buttonTextColor || '#000' }}>@{username}</h2>
        <p className="text-center mb-4 opacity-75" style={{ color: theme?.buttonTextColor || '#000' }}>
          {profile?.bio || '¡Bienvenido a mi página!'}
        </p>

        <div className="w-100 d-grid gap-3 mb-5">
          {links.map((link) => (
            <Button
              key={link._id}
              href={link.url}
              target="_blank"
              className="py-3 shadow-sm border-0 fw-bold hover-lift"
              style={{ 
                backgroundColor: theme?.buttonColor || '#000',
                color: theme?.buttonTextColor || '#fff',
                borderRadius: '15px'
              }}
            >
              {link.title}
            </Button>
          ))}
        </div>

        <div className="d-flex gap-4 fs-2">
          {socials?.instagram && <a href={socials.instagram} target="_blank" style={{ color: theme?.buttonColor || '#000' }}><FaInstagram /></a>}
          {socials?.twitter && <a href={socials.twitter} target="_blank" style={{ color: theme?.buttonColor || '#000' }}><FaTwitter /></a>}
          {socials?.github && <a href={socials.github} target="_blank" style={{ color: theme?.buttonColor || '#000' }}><FaGithub /></a>}
          {(!socials?.instagram && !socials?.twitter && !socials?.github) && <FaGlobe className="opacity-25" />}
        </div>
      </Container>
    </div>
  );
};

export default PublicPage;