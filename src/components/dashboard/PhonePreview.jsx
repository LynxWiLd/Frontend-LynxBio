import { FaInstagram, FaGithub, FaXTwitter } from "react-icons/fa6";
import styles from "./PhonePreview.module.css";

const PhonePreview = ({ settings, links }) => {
  const { profile, socials, theme } = settings;

  return (
    <div className={styles.phoneMockup}>
      <div
        className={styles.phoneScreen}
        style={{
          backgroundColor: theme.backgroundColor,
          backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : "none",
        }}
      >
        {/* Capa oscura si hay fondo */}
        {theme.backgroundImage && <div className={styles.phoneOverlay} />}

        <div
          className={styles.phoneGlassCard}
          style={{ color: theme.textColor }}
        >
          <img
            src={profile.avatarUrl || "https://via.placeholder.com/150"}
            className={styles.previewAvatar}
            style={{ borderColor: theme.buttonColor }}
            alt="Avatar"
          />
          <h5 className="fw-bold mt-2">
            @{profile.username || "usuario"}
          </h5>
          <p className={styles.previewBio}>{profile.bio}</p>

          <div className={styles.previewLinks}>
            {links.map((link) => (
              <div
                key={link._id}
                className={styles.previewLinkItem}
                style={{
                  backgroundColor: link.buttonColor,
                  color: link.buttonTextColor,
                  backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1))`,
                }}
              >
                {link.title}
              </div>
            ))}
          </div>

          <div className={styles.socialIconsPreview}>
            {socials.instagram && <FaInstagram className="mx-2" />}
            {socials.github && <FaGithub className="mx-2" />}
            {socials.twitter && <FaXTwitter className="mx-2" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;