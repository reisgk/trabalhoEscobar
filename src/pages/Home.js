import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const USUARIO = '010623048'; // Usuário cadastrado/admin

const spinner = (
  <div style={{ textAlign: 'center', margin: 20 }}>
    <div style={{
      display: 'inline-block',
      width: 32,
      height: 32,
      border: '4px solid #444',
      borderTop: '4px solid #00bcd4',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
  </div>
);

const btn = {
  background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', margin: '0 2px', transition: 'background 0.2s',
};
const btnPrimary = { ...btn, background: '#00bcd4', color: '#fff', border: 'none' };
const card = {
  background: '#232323',
  color: '#fff',
  borderRadius: 24,
  boxShadow: '0 4px 24px #0004',
  padding: 28,
  width: 320,
  minHeight: 420,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginBottom: 24,
  position: 'relative',
  border: 'none',
};
const imgBox = {
  background: '#fff',
  borderRadius: 16,
  width: '100%',
  minHeight: 180,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 18,
  overflow: 'hidden',
};
const btnComprar = {
  background: '#0071e3',
  color: '#fff',
  border: 'none',
  borderRadius: 22,
  padding: '10px 32px',
  fontWeight: 600,
  fontSize: 18,
  marginTop: 18,
  alignSelf: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 8px #0002',
  transition: 'background 0.2s',
};
const select = { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6, padding: 8, marginLeft: 8 };
const categoriaStyle = {
  fontSize: 13,
  color: '#bdbdbd',
  fontWeight: 500,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: 1,
};
const precoAntigoStyle = {
  color: '#888',
  fontSize: 14,
  textDecoration: 'line-through',
  marginBottom: 2,
};
const precoStyle = {
  fontSize: 20,
  color: '#fff',
  fontWeight: 600,
  margin: '18px 0 0 0',
};
const descontoStyle = {
  color: '#1db954',
  fontWeight: 600,
  fontSize: 15,
  marginLeft: 8,
};
const nomeStyle = {
  fontSize: 26,
  fontWeight: 700,
  margin: '0 0 10px 0',
  lineHeight: 1.1,
};
const descStyle = {
  fontSize: 14,
  color: '#444',
  margin: '6px 0 0 0',
  minHeight: 32,
};

const Home = () => {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const { addToCart } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProdutos();
  }, [categoriaSelecionada]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await api.get(`/produtos/${USUARIO}/`);
      const produtos = res.data;
      const cats = Array.from(new Set(produtos.map(p => p.categoria).filter(Boolean)));
      setCategorias(cats);
    } catch (err) {
      setCategorias([]);
    }
  };

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/produtos/${USUARIO}/`);
      let produtos = res.data;
      if (categoriaSelecionada) {
        produtos = produtos.filter(p => p.categoria === categoriaSelecionada);
      }
      setProdutos(produtos);
    } catch (err) {
      setProdutos([]);
    }
    setLoading(false);
  };

  const handleAddToCart = (prod) => {
    addToCart(prod);
    setMsg('Produto adicionado ao carrinho!');
    setTimeout(() => setMsg(''), 1500);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20, background: '#181818', minHeight: '100vh', borderRadius: 10 }}>
      <h1 style={{ color: '#00bcd4' }}>Loja Virtual</h1>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
        <label style={{ color: '#fff' }}>Filtrar por categoria: </label>
        <select
          value={categoriaSelecionada}
          onChange={e => setCategoriaSelecionada(e.target.value)}
          style={select}
        >
          <option value="">Todas</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {msg && <p style={{ color: '#00bcd4', fontWeight: 'bold' }}>{msg}</p>}
      {loading ? (
        spinner
      ) : produtos.length === 0 ? (
        <p style={{ color: '#fff' }}>Nenhum produto encontrado.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {produtos.map(prod => (
            <div key={prod._id} style={card}>
              <div style={categoriaStyle}>{prod.categoria}</div>
              <div style={nomeStyle}>{prod.nome}</div>
              <div style={imgBox}>
                <img src={prod.imagem} alt={prod.nome} style={{ maxWidth: 220, maxHeight: 160, objectFit: 'contain', margin: '0 auto' }} />
              </div>
              <div style={precoStyle}>R$ {prod.preco.toFixed(2)}</div>
              <button style={btnComprar} onClick={() => handleAddToCart(prod)}>Comprar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 