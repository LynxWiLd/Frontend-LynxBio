import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-auto border-top text-center text-muted">
      <Container>
        <p className="mb-0">© {new Date().getFullYear()} <strong>LynxBio</strong> - Hecho con ❤️ en Tucumán</p>
        <small>Junior Full-Stack Project</small>
      </Container>
    </footer>
  );
};

export default Footer;