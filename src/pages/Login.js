import React, { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const cardStyle = {
  maxWidth: 400,
  margin: '80px auto',
  padding: 36,
  background: '#232323',
  color: '#fff',
  borderRadius: 18,
  boxShadow: '0 4px 32px #0005',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
const input = {
  background: '#181818',
  color: '#fff',
  border: '1.5px solid #444',
  borderRadius: 8,
  padding: '12px 14px',
  marginBottom: 18,
  width: '100%',
  fontSize: 16,
  outline: 'none',
  transition: 'border 0.2s',
};
const btn = {
  background: '#00bcd4',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 0',
  width: '100%',
  fontWeight: 700,
  fontSize: 18,
  marginTop: 8,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #0002',
  transition: 'background 0.2s',
};
const erroStyle = {
  color: '#e53935',
  fontWeight: 'bold',
  marginTop: 10,
  marginBottom: 0,
  fontSize: 16,
};
const titleStyle = {
  color: '#00bcd4',
  fontSize: 32,
  fontWeight: 800,
  marginBottom: 24,
  letterSpacing: 1,
};

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await api.post('/login', { usuario, senha });
      login(res.data.token, usuario);
      setLoading(false);
      navigate('/admin');
    } catch (err) {
      setErro('Usuário ou senha inválidos.');
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>Login Administrativo</div>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          style={input}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          style={input}
          disabled={loading}
        />
        {erro && <p style={erroStyle}>{erro}</p>}
        <button type="submit" disabled={loading} style={btn}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login; 