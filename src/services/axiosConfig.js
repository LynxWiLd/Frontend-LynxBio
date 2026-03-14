import axios from "axios";

const api = axios.create({
  // Vite usa import.meta.env para las variables de entorno.
  // Si no encuentra la variable, usa el localhost por defecto.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// INTERCEPTOR: Se ejecuta antes de cada petición al servidor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // DEBUG: Descomentá la línea de abajo si querés ver en consola a qué URL le estás pegando
    // console.log("Petición a:", config.baseURL + config.url);

    if (token) {
      // Usamos el header que configuraste en tu backend
      config.headers["x-auth-token"] = token;

      // NOTA: Si en el futuro tu backend usa Passport o JWT estándar,
      // la línea suele ser: config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
