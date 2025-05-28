import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

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

const Produto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const { addToCart } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }
    const fetchProduto = async () => {
      setLoading(true);
      try {
        // Buscar produtos do usuário autenticado
        const res = await api.get(`/produtos/${usuario}/`);
        const prod = res.data.find(p => p._id === id);
        setProduto(prod);
      } catch (err) {
        setProduto(null);
      }
      setLoading(false);
    };
    fetchProduto();
  }, [id, usuario, navigate]);

  const handleAddToCart = () => {
    addToCart(produto);
    setMsg('Produto adicionado ao carrinho!');
    setTimeout(() => setMsg(''), 1500);
  };

  if (loading) return spinner;
  if (!produto) return <p style={{ color: '#fff' }}>Produto não encontrado.</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, background: '#181818', color: '#fff', borderRadius: 10 }}>
      <h1 style={{ color: '#00bcd4' }}>{produto.nome}</h1>
      <img src={produto.imagem} alt={produto.nome} style={{ width: '100%', maxWidth: 350, height: 200, objectFit: 'cover', borderRadius: 8 }} />
      <p><strong>Preço:</strong> <span style={{ color: '#00bcd4' }}>R$ {produto.preco.toFixed(2)}</span></p>
      <p><strong>Categoria:</strong> {produto.categoria}</p>
      <p><strong>Descrição:</strong> {produto.descricao}</p>
      <button onClick={handleAddToCart} style={{ ...btnPrimary, marginTop: 16 }}>Adicionar ao carrinho</button>
      {msg && <p style={{ color: '#00bcd4', fontWeight: 'bold', marginTop: 10 }}>{msg}</p>}
    </div>
  );
};

export default Produto; 