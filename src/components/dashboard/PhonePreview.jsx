import { FaInstagram, FaGithub, FaXTwitter } from "react-icons/fa6";
import { ICON_MAP } from "../../constants/iconMap";
import styles from "./PhonePreview.module.css";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dqlm5tnhk/image/upload/v1773873679/IconProfile_hoxpyj.svg";

const PhonePreview = ({ settings, links }) => {
  const { profile, socials, theme } = settings;

  return (
    <div className={styles.phoneMockup}>
      <div
        className={styles.phoneScreen}
        style={{
          backgroundColor: theme.backgroundColor,
          backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {theme.backgroundImage && <div className={styles.phoneOverlay} />}

        <div className={styles.phoneGlassCard} style={{ color: theme.textColor }}>
          <img
            src={profile.avatarUrl || DEFAULT_AVATAR}
            className={styles.previewAvatar}
            style={{ borderColor: theme.buttonColor }}
            alt="Avatar"
          />
          
          {/* 🪄 Username con truncado */}
          <span className={styles.previewUsername}>
            @{profile.username || "nuevo_lince"}
          </span>
          
          {/* 🪄 Bio con line-clamp */}
          {profile.bio && <p className={styles.previewBio}>{profile.bio}</p>}

          <div className={styles.previewLinks}>
            {links.length === 0 ? (
              <div className={styles.emptyLinksHint}>
                Tus links aparecerán aquí...
              </div>
            ) : (
              links.map((link) => {
                const LinkIcon = ICON_MAP[link.icon] || ICON_MAP.web;
                
                return (
                  <div
                    key={link._id || Math.random()}
                    className={styles.previewLinkItem}
                    style={{
                      backgroundColor: link.buttonColor || theme.buttonColor,
                      color: link.buttonTextColor || theme.textColor,
                    }}
                  >
                    <span className={styles.linkIconWrapper}>
                      <LinkIcon />
                    </span>
                    {/* 🪄 Texto del link blindado contra desbordes */}
                    <span className={styles.linkTitleText}>{link.title}</span>
                  </div>
                );
              })
            )}
          </div>

          <div className={styles.socialIconsPreview} style={{ color: theme.textColor }}>
            {socials.instagram && <FaInstagram />}
            {socials.github && <FaGithub />}
            {socials.twitter && <FaXTwitter />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;