// src/constants/iconMap.jsx
import { 
  FaYoutube, FaTiktok, FaTwitch, FaSpotify, 
  FaGlobe, FaLinkedin, FaInstagram, FaGithub, FaGamepad,
  FaFacebook, FaWhatsapp
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

// Guardamos la referencia al componente (sin los < />)
export const ICON_MAP = {
  web: FaGlobe,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  twitch: FaTwitch,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  github: FaGithub,
  spotify: FaSpotify,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
  gaming: FaGamepad,
};

export const ICON_OPTIONS = [
  { value: "web", label: "🌐 Web / Global" },
  { value: "youtube", label: "📺 YouTube" },
  { value: "tiktok", label: "🎵 TikTok" },
  { value: "twitch", label: "🎮 Twitch" },
  { value: "twitter", label: "🐦 X (Twitter)" },
  { value: "instagram", label: "📸 Instagram" },
  { value: "github", label: "💻 GitHub" },
  { value: "spotify", label: "🎧 Spotify" },
  { value: "gaming", label: "🕹️ Gaming / Roblox" },
];