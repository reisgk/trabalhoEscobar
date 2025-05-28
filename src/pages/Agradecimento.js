import React from 'react';
import { Link } from 'react-router-dom';

const btnPrimary = {
  background: '#00bcd4', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', marginTop: 24, fontSize: 18
};

const Agradecimento = () => {
  return (
    <div style={{ maxWidth: 500, margin: '60px auto', padding: 32, background: '#181818', color: '#fff', borderRadius: 12, textAlign: 'center' }}>
      <h1 style={{ color: '#00bcd4' }}>Obrigado pela sua compra!</h1>
      <p style={{ fontSize: 18, margin: '24px 0' }}>Seu pedido foi realizado com sucesso.<br />Em breve você receberá um e-mail com os detalhes.</p>
      <Link to="/">
        <button style={btnPrimary}>Voltar para a loja</button>
      </Link>
    </div>
  );
};

export default Agradecimento; 