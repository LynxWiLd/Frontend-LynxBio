import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Tabs,
  Tab,
  Row,
  Col,
  ListGroup,
  Spinner,
  Modal,
} from "react-bootstrap";
import { FaCopy, FaPalette, FaLink, FaEye } from "react-icons/fa";
import { FaInstagram, FaGithub, FaXTwitter } from "react-icons/fa6";
import Swal from "sweetalert2";

import api from "../../services/axiosConfig";
import styles from "./Dashboard.module.css"; // 👈 IMPORTANTE

import AddLinkCard from "../../components/dashboard/AddLinkCard";
import LinkItem from "../../components/dashboard/LinkItem";
import AppearanceForm from "../../components/dashboard/AppearanceForm";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const [settings, setSettings] = useState({
    profile: { bio: "", avatarUrl: "", username: "" },
    socials: { instagram: "", github: "", twitter: "" },
    theme: {
      backgroundColor: "#ffffff",
      backgroundImage: "",
      buttonColor: "#000000",
      textColor: "#000000",
    },
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/auth/me");
      setLinks(res.data.links || []);
      setSettings({
        profile: {
          bio: res.data.profile?.bio || "",
          avatarUrl: res.data.profile?.avatarUrl || "",
          username: res.data.username || "",
        },
        socials: {
          instagram: res.data.socials?.instagram || "",
          github: res.data.socials?.github || "",
          twitter: res.data.socials?.twitter || "",
        },
        theme: { ...res.data.theme },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.put("/auth/settings", settings);
      Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error" });
    }
  };

  const PhonePreview = () => (
    <div className={styles.phoneMockup}>
      <div
        className={styles.phoneScreen}
        style={{
          backgroundColor: settings.theme.backgroundColor,
          backgroundImage: settings.theme.backgroundImage
            ? `url(${settings.theme.backgroundImage})`
            : "none",
          color: settings.theme.textColor,
        }}
      >
        <div className={styles.previewContent}>
          <img
            src={
              settings.profile.avatarUrl || "https://via.placeholder.com/150"
            }
            className={styles.previewAvatar}
            style={{ borderColor: settings.theme.buttonColor }}
            alt="Avatar"
          />
          <h5 className="fw-bold mt-2">
            @{settings.profile.username || "usuario"}
          </h5>
          <p>{settings.profile.bio}</p>
          <div className={styles.previewLinks}>
            {links.map((link) => (
              <div
                key={link._id}
                className={styles.previewLinkItem}
                style={{
                  backgroundColor: link.buttonColor,
                  color: link.buttonTextColor,
                }}
              >
                {link.title}
              </div>
            ))}
          </div>
          <div className={styles.socialIconsPreview}>
            {settings.socials.instagram && <FaInstagram className="mx-2" />}
            {settings.socials.github && <FaGithub className="mx-2" />}
            {settings.socials.twitter && <FaXTwitter className="mx-2" />}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Sincronizando...</p>
      </Container>
    );

  return (
    <Container fluid className={styles.dashboardWrapper}>
      <Row className="h-100">
        <Col lg={7} xl={8} className={styles.configColumn}>
          <h2 className="fw-bold mb-4">Panel de Control</h2>
          <Tabs defaultActiveKey="links" className="mb-4">
            <Tab
              eventKey="links"
              title={
                <span>
                  <FaLink className="me-2" /> Enlaces
                </span>
              }
            >
              {/* Aquí van tus componentes de Links */}
              <ListGroup variant="flush">
                {links.map((link) => (
                  <LinkItem key={link._id} link={link} />
                ))}
              </ListGroup>
            </Tab>
            <Tab
              eventKey="appearance"
              title={
                <span>
                  <FaPalette className="me-2" /> Apariencia
                </span>
              }
            >
              <AppearanceForm
                settings={settings}
                setSettings={setSettings}
                handleSaveSettings={handleSaveSettings}
              />
            </Tab>
          </Tabs>
        </Col>
        <Col lg={5} xl={4} className={styles.previewColumn}>
          <div className={styles.phoneSticky}>
            <PhonePreview />
          </div>
        </Col>
      </Row>

      <Button
        className={`btn-primary ${styles.mobilePreviewBtn}`}
        onClick={() => setShowMobilePreview(true)}
      >
        <FaEye className="me-2" /> Vista previa
      </Button>

      <Modal
        show={showMobilePreview}
        onHide={() => setShowMobilePreview(false)}
        centered
        className={styles.mobileModal}
      >
        <Modal.Body className="d-flex justify-content-center bg-light">
          <PhonePreview />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;
