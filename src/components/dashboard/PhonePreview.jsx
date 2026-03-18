import { FaInstagram, FaGithub, FaXTwitter } from "react-icons/fa6";
import { ICON_MAP } from "../../constants/iconMap"; // 🪄 Importamos el mapa para ver los iconos de los links
import styles from "./PhonePreview.module.css";

// 🪄 Tu SVG oficial para el rastro inicial
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
        {/* Capa oscura si hay fondo para que el texto resalte */}
        {theme.backgroundImage && <div className={styles.phoneOverlay} />}

        <div
          className={styles.phoneGlassCard}
          style={{ color: theme.textColor }}
        >
          {/* AVATAR: Con object-fit para que no se estire */}
          <img
            src={profile.avatarUrl || DEFAULT_AVATAR}
            className={styles.previewAvatar}
            style={{ borderColor: theme.buttonColor }}
            alt="Avatar"
          />
          
          <h5 className="fw-bold mt-2">
            @{profile.username || "nuevo_lince"}
          </h5>
          
          {profile.bio && <p className={styles.previewBio}>{profile.bio}</p>}

          {/* LISTADO DE ENLACES */}
          <div className={styles.previewLinks}>
            {links.length === 0 && (
              <div className={styles.emptyLinksHint}>
                Tus links aparecerán aquí...
              </div>
            )}
            
            {links.map((link) => {
              // 🪄 Buscamos el icono correspondiente según lo que guardó el usuario
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
                  <span className={styles.linkTitleText}>{link.title}</span>
                </div>
              );
            })}
          </div>

          {/* ICONOS DE REDES SOCIALES (FOOTER DEL MOCKUP) */}
          <div className={styles.socialIconsPreview} style={{ color: theme.textColor }}>
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