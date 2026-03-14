// src/constants/iconMap.js
import {
  FaYoutube,
  FaTiktok,
  FaTwitch,
  FaSpotify,
  FaGlobe,
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaGamepad,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const ICON_MAP = {
  web: <FaGlobe />,
  youtube: <FaYoutube />,
  tiktok: <FaTiktok />,
  twitch: <FaTwitch />,
  twitter: <FaXTwitter />,
  instagram: <FaInstagram />,
  github: <FaGithub />,
  spotify: <FaSpotify />,
  linkedin: <FaLinkedin />,
  facebook: <FaFacebook />,
  whatsapp: <FaWhatsapp />,
  gaming: <FaGamepad />,
};

// Esto te sirve para llenar los <option> del select automáticamente
export const ICON_OPTIONS = [
  { value: "web", label: "🌐 Web / Global" },
  { value: "youtube", label: "📺 YouTube" },
  { value: "tiktok", label: "🎵 TikTok" },
  { value: "twitch", label: "🎮 Twitch" },
  { value: "twitter", label: "🐦 X (Twitter)" },
  { value: "instagram", label: "📸 Instagram" },
  { value: "github", label: "💻 GitHub" },
  { value: "spotify", label: "🎧 Spotify" },
  { value: "gaming", label: "🕹️ Gaming" },
];
