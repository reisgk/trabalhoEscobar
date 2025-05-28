import React from 'react';
import { NavLink } from 'react-router-dom';

const navStyle = {
  padding: '1rem',
  background: '#181818',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 24,
  borderRadius: 0,
  borderBottom: '2px solid #00bcd4',
  marginBottom: 24
};
const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: 18,
  padding: '6px 14px',
  borderRadius: 6,
  transition: 'background 0.2s, color 0.2s'
};
const activeStyle = {
  background: '#00bcd4',
  color: '#181818',
};

const Navbar = () => {
  return (
    <nav style={navStyle}>
      <NavLink to="/" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle} end>
        Home
      </NavLink>
      <NavLink to="/carrinho" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
        Carrinho
      </NavLink>
      <NavLink to="/login" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
        Admin
      </NavLink>
    </nav>
  );
};

export default Navbar; 