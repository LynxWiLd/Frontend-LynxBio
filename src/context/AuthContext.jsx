import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados de Modales (Centralizados)
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // --- 🪄 FUNCIONES DE CONTROL DE MODALES ---
  const handleOpenLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  const handleOpenRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };
  const handleCloseModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  /**
   * --- 🔍 VALIDACIÓN DE RASTRO (Check User) ---
   * No solo mira el localStorage, le pregunta al servidor: "¿Quién soy?"
   */
  const checkUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // El interceptor de axios ya pega el token automáticamente 🪄
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Rastro expirado o inválido:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  /**
   * --- 🚀 LOGIN ---
   */
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // Solo guardamos el token. El resto vive en el estado global.
      localStorage.setItem("token", res.data.token);

      setUser(res.data);
      handleCloseModals();
      return res.data;
    } catch (err) {
      throw err; // El componente (Modal) captura esto para mostrar el error
    }
  };

  /**
   * --- 📝 REGISTER ---
   */
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      localStorage.setItem("token", res.data.token);

      // Seteamos el usuario y cerramos modales
      setUser(res.data);
      handleCloseModals();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  /**
   * --- 🚪 LOGOUT ---
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Redirección total para limpiar cualquier rastro en memoria
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // Útil para actualizar perfil/avatar en tiempo real
        loading,
        login,
        register,
        logout,
        showLogin,
        showRegister,
        handleOpenLogin,
        handleOpenRegister,
        handleCloseModals,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
