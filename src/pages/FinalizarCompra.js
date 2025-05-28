import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const USUARIO = '123'; // Usuário vitrine

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
const btnDisabled = { ...btn, background: '#444', color: '#888', cursor: 'not-allowed' };
const input = { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6, padding: 8, marginBottom: 12, width: '100%' };

const FinalizarCompra = () => {
  const { cart, clearCart } = useCart();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome) {
      setErro('Informe seu nome para finalizar a compra.');
      return;
    }
    if (cart.length === 0) {
      setErro('Seu carrinho está vazio.');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      const venda = {
        nomeCliente: nome,
        usuario: '010623048', // sempre o admin
        data: new Date().toISOString().slice(0, 10),
        produtos: cart.map(item => ({
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco
        }))
      };
      await api.post('/venda', venda);
      // Atualizar estoque dos produtos
      for (const item of cart) {
        // Buscar produto atual para pegar a quantidade correta
        const res = await api.get(`/produtos/${USUARIO}/`);
        const produtoAtual = res.data.find(p => p._id === item._id);
        if (produtoAtual) {
          const novaQuantidade = produtoAtual.quantidade - item.quantidade;
          await api.put('/produtos', {
            id: produtoAtual._id,
            nome: produtoAtual.nome,
            quantidade: novaQuantidade,
            preco: produtoAtual.preco,
            categoria: produtoAtual.categoria,
            descricao: produtoAtual.descricao,
            imagem: produtoAtual.imagem
          });
        }
      }
      clearCart();
      navigate('/obrigado');
    } catch (err) {
      setErro('Erro ao finalizar compra. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20, background: '#181818', color: '#fff', borderRadius: 10 }}>
      <h1 style={{ color: '#00bcd4' }}>Finalizar Compra</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome do comprador:</label><br />
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={input}
            disabled={loading}
          />
        </div>
        {erro && <p style={{ color: '#e53935', fontWeight: 'bold' }}>{erro}</p>}
        <button type="submit" disabled={loading} style={loading ? btnDisabled : btnPrimary}>
          {loading ? spinner : 'Finalizar Compra'}
        </button>
      </form>
    </div>
  );
};

export default FinalizarCompra; 