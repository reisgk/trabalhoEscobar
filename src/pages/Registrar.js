import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const btnPrimary = {
  background: '#00bcd4', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', marginTop: 16, fontSize: 18
};
const input = { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6, padding: 8, marginBottom: 12, width: '100%' };

const Registrar = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    if (!usuario || !senha || !confirma) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha !== confirma) {
      setErro('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/registrar', { usuario, senha, confirma });
      setSucesso('Usuário cadastrado com sucesso!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao registrar usuário.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 32, background: '#181818', color: '#fff', borderRadius: 12, textAlign: 'center' }}>
      <h1 style={{ color: '#00bcd4' }}>Cadastro de Usuário</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <input
          type="text"
          placeholder="Usuário (RA ou nome)"
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
        <input
          type="password"
          placeholder="Confirme a senha"
          value={confirma}
          onChange={e => setConfirma(e.target.value)}
          style={input}
          disabled={loading}
        />
        {erro && <p style={{ color: '#e53935', fontWeight: 'bold' }}>{erro}</p>}
        {sucesso && <p style={{ color: '#00bcd4', fontWeight: 'bold' }}>{sucesso}</p>}
        <button type="submit" style={btnPrimary} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default Registrar; 