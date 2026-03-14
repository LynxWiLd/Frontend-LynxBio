import { createContext, useState, useEffect } from "react";
import api from "../api/axios"; // Usamos tu instancia de axios configurada

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para controlar la visibilidad de los modales
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Funciones de control de modales (centralizadas)
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

  // Efecto inicial: Persistencia de sesión
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("username");

      if (token && storedUsername) {
        // Opcional: Podrías llamar a /auth/me aquí para validar el token real
        setUser({ username: storedUsername, token });
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // Función de Login: Se encarga de la API y el Estado
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // Guardamos en persistencia
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);

      // Actualizamos estado global
      setUser({
        username: res.data.username,
        token: res.data.token,
        profile: res.data.profile,
      });

      return res.data;
    } catch (err) {
      // Lanzamos el error para que el Modal lo capture con el Catch
      throw err;
    }
  };

  // Función de Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    window.location.href = "/"; // Redirigimos al home al salir
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login, // <--- ¡AHORA SÍ ESTÁN EXPORTADAS!
        logout, // <--- ¡AHORA SÍ ESTÁN EXPORTADAS!
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
