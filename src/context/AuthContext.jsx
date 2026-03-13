import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, vemos si hay un token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí podrías hacer una petición al backend para validar el token
      // Por ahora, solo lo damos por válido y guardamos el username
      const storedUser = localStorage.getItem('username');
      setUser({ username: storedUser, token });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('username', userData.username);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};