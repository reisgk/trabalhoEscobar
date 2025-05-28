import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: 32,
  padding: '40px 0',
  maxWidth: 1200,
  margin: '0 auto',
};
const card = {
  background: '#232323',
  borderRadius: 16,
  boxShadow: '0 4px 24px #0003',
  padding: 32,
  flex: 1,
  minWidth: 380,
  color: '#fff',
};
const resumo = {
  background: '#232323',
  borderRadius: 16,
  boxShadow: '0 2px 12px #0002',
  padding: 16,
  minWidth: 220,
  maxWidth: 240,
  color: '#fff',
  marginTop: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
const item = {
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  borderBottom: '1px solid #333',
  padding: '24px 0',
};
const imgBox = {
  background: '#fff',
  borderRadius: 10,
  width: 110,
  height: 110,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};
const nomeStyle = {
  fontSize: 18,
  fontWeight: 700,
  color: '#fff',
  marginBottom: 6,
};
const precoStyle = {
  fontSize: 18,
  color: '#00bcd4',
  fontWeight: 700,
  margin: '8px 0',
};
const qtdBox = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: '#181818',
  borderRadius: 8,
  padding: '4px 12px',
  fontWeight: 600,
};
const btnQtd = {
  background: '#00bcd4',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  width: 28,
  height: 28,
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
  boxShadow: '0 1px 4px #0001',
  transition: 'background 0.2s',
};
const btnRemover = {
  background: 'none',
  color: '#e53935',
  border: 'none',
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
  marginLeft: 12,
};
const btnFinalizar = {
  background: '#00bcd4',
  color: '#fff',
  border: 'none',
  borderRadius: 22,
  padding: '8px 0',
  width: '100%',
  fontWeight: 700,
  fontSize: 15,
  marginTop: 12,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #0002',
  transition: 'background 0.2s',
};
const btnEsvaziar = {
  ...btnFinalizar,
  background: '#e53935',
  color: '#fff',
  marginTop: 8,
  border: 'none',
};
const labelFrete = {
  display: 'none',
};
const hrStyle = {
  border: 'none',
  borderTop: '1px solid #333',
  margin: '12px 0 18px 0',
  width: '100%',
};

const Carrinho = () => {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  const handleFinalizar = () => {
    navigate('/finalizar');
  };

  const handleAddQtd = (item) => {
    addToCart(item);
  };

  const handleSubQtd = (item) => {
    if (item.quantidade > 1) {
      // Remove 1 unidade (simula subtração)
      removeFromCart(item._id);
      // Adiciona de volta com quantidade - 1
      for (let i = 0; i < item.quantidade - 1; i++) {
        addToCart({ ...item, quantidade: 1 });
      }
    } else {
      removeFromCart(item._id);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 30, marginBottom: 0 }}>Carrinho de compras</h1>
        <hr style={hrStyle} />
        {cart.length === 0 ? (
          <p style={{ color: '#fff' }}>Seu carrinho está vazio.</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item._id} style={item}>
                <div style={{ ...imgBox, marginRight: 16 }}>
                  <img src={item.imagem} alt={item.nome} style={{ maxWidth: 90, maxHeight: 90, objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 110 }}>
                  <div style={nomeStyle}>{item.nome}</div>
                  <div style={precoStyle}>R$ {item.preco.toFixed(2)}</div>
                  <div style={{ marginTop: 10 }}>
                    <div style={qtdBox}>
                      <button style={btnQtd} onClick={() => handleSubQtd(item)}>-</button>
                      {item.quantidade}
                      <button style={btnQtd} onClick={() => handleAddQtd(item)}>+</button>
                      <button style={btnRemover} onClick={() => removeFromCart(item._id)} title="Remover">🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div style={resumo}>
        <div style={{ fontWeight: 700, fontSize: 16, margin: '6px 0 12px 0', textAlign: 'center' }}>
          Subtotal ({cart.length} produto{cart.length > 1 ? 's' : ''}):<br />
          <span style={{ fontSize: 20 }}>R$ {total.toFixed(2)}</span>
        </div>
        <button style={btnFinalizar} onClick={handleFinalizar}>Fechar pedido</button>
        <button style={btnEsvaziar} onClick={clearCart}>Esvaziar Carrinho</button>
      </div>
    </div>
  );
};

export default Carrinho; 