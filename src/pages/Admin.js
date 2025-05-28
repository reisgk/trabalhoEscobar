import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import CategoriasAdmin from './CategoriasAdmin';
import ProdutosAdmin from './ProdutosAdmin';
import VendasAdmin from './VendasAdmin';

const miniNavStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 18,
  background: '#181818',
  padding: '10px 0',
  borderRadius: 8,
  marginBottom: 24,
  justifyContent: 'center',
};
const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: 16,
  padding: '6px 14px',
  borderRadius: 6,
  transition: 'background 0.2s, color 0.2s'
};
const activeStyle = {
  background: '#00bcd4',
  color: '#181818',
};
const btn = {
  background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 500, fontSize: 16, marginLeft: 10
};

const Admin = () => {
  const { token, usuario, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token || usuario !== '010623048') {
      logout();
      navigate('/login', { state: { error: 'Acesso restrito ao administrador.' } });
    }
  }, [token, usuario, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (usuario !== '010623048') {
    return (
      <div style={{ color: '#e53935', textAlign: 'center', marginTop: 60, fontWeight: 'bold', fontSize: 22 }}>
        Acesso restrito ao administrador.<br />
        Faça login com o usuário autorizado.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1 style={{ color: '#00bcd4' }}>Painel Administrativo</h1>
      <p>Bem-vindo, <strong>{usuario}</strong>!</p>
      <nav style={miniNavStyle}>
        <NavLink to="/admin/categorias" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          Categorias
        </NavLink>
        <NavLink to="/admin/produtos" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          Produtos
        </NavLink>
        <NavLink to="/admin/vendas" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          Vendas
        </NavLink>
        <button onClick={handleLogout} style={btn}>Logout</button>
      </nav>
      <Routes>
        <Route path="categorias" element={<CategoriasAdmin />} />
        <Route path="produtos" element={<ProdutosAdmin />} />
        <Route path="vendas" element={<VendasAdmin />} />
      </Routes>
    </div>
  );
};

export default Admin; 