import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(() => localStorage.getItem('usuario'));

  const login = (token, usuario) => {
    setToken(token);
    setUsuario(usuario);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', usuario);
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 