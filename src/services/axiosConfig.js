import axios from "axios";

const api = axios.create({
  // Vite usa import.meta.env para las variables de entorno.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ==========================================
 * 1. INTERCEPTOR DE PETICIONES (Request)
 * ==========================================
 * Antes de que la petición salga, le pegamos el rastro (token).
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // 🛡️ Soportamos ambos estilos por seguridad y estándar
      config.headers["x-auth-token"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * ==========================================
 * 2. INTERCEPTOR DE RESPUESTAS (Response) 🪄
 * ==========================================
 * Si el servidor nos dice que el rastro expiró (401),
 * limpiamos la sesión local automáticamente.
 */
api.interceptors.response.use(
  (response) => response, // Si todo sale bien, pasamos la respuesta
  (error) => {
    // 🚨 Si el error es 401 (Unauthorized / Expired)
    if (error.response && error.response.status === 401) {
      console.warn("Rastro digital expirado o inválido. Cerrando sesión...");

      // Limpiamos el localStorage para que el AuthContext sepa que no hay lince
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirigimos al lince al login si no está ahí ya
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/login?expired=true";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
