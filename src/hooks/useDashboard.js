// src/hooks/useDashboard.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/axiosConfig";
import Swal from "sweetalert2";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dqlm5tnhk/image/upload/v1773873679/IconProfile_hoxpyj.svg";

export const useDashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    profile: { bio: "", avatarUrl: DEFAULT_AVATAR, username: "" },
    socials: { instagram: "", github: "", twitter: "" },
    theme: { backgroundColor: "#ffffff", backgroundImage: "", buttonColor: "#000000", textColor: "#000000" },
  });

  // 🪄 Sincronización con la manada (Fetch)
  const fetchUserData = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      const { links: userLinks, profile, socials, theme, username } = res.data;
      setLinks(userLinks || []);
      setSettings({
        profile: { bio: profile?.bio || "", avatarUrl: profile?.avatarUrl || DEFAULT_AVATAR, username: username || "" },
        socials: { instagram: socials?.instagram || "", github: socials?.github || "", twitter: socials?.twitter || "" },
        theme: { ...theme },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // 🪄 Lógica de Drag & Drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const oldLinks = [...links];
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLinks(items);
    try {
      await api.put("/links/reorder", { newOrder: items.map(l => l._id) });
    } catch (err) {
      setLinks(oldLinks);
      Swal.fire({ icon: "error", title: "Error al reordenar" });
    }
  };

  // 🪄 Handlers de Enlaces
  const handleAddLink = async (data) => {
    try {
      const res = await api.post("/links", data);
      setLinks(res.data.links || res.data);
      Swal.fire({ icon: "success", title: "¡Link agregado!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al crear" });
    }
  };

  const handleDeleteLink = async (id) => {
    const result = await Swal.fire({
      title: "¿Borrar este link?",
      text: "No habrá vuelta atrás.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      background: "var(--bg-card)",
      color: "var(--text-main)",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/links/${id}`);
        setLinks(res.data.links || res.data);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error al borrar" });
      }
    }
  };

  // 🪄 Gestión de Identidad (Settings)
  const handleSaveSettings = async () => {
    try {
      const res = await api.put("/auth/settings", settings);
      setSettings(prev => ({ ...prev, ...res.data }));
      Swal.fire({ icon: "success", title: "¡Rastro guardado!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error al guardar" });
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${settings.profile.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Swal.fire({ icon: "success", title: "¡Copiado!", timer: 1000, showConfirmButton: false });
  };

  return {
    links, settings, setSettings, loading, copied, showMobilePreview,
    setShowMobilePreview, handleDragEnd, handleAddLink, handleDeleteLink,
    handleSaveSettings, copyToClipboard
  };
};