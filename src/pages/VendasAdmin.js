import React, { useEffect, useState } from 'react';
import api from '../api/api';
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
const btnDanger = { ...btn, background: '#e53935', color: '#fff', border: 'none' };
const btnDisabled = { ...btn, background: '#444', color: '#888', cursor: 'not-allowed' };

const tableStyle = { width: '100%', maxWidth: 900, background: '#181818', color: '#fff', borderCollapse: 'collapse', borderRadius: 8, overflow: 'hidden', marginTop: 10 };
const thtd = { border: '1px solid #333', padding: 10 };
const trHover = { background: '#222' };

const VendasAdmin = () => {
  const { token } = useAuth();
  const [vendas, setVendas] = useState([]);
  const [detalhe, setDetalhe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (token) {
      fetchVendas();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchVendas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/venda', { headers: { Authorization: `Bearer ${token}` } });
      setVendas(res.data);
    } catch (err) {
      setErro('Erro ao buscar vendas.');
    }
    setLoading(false);
  };

  const handleDetalhe = (venda) => {
    setDetalhe(venda);
  };

  const handleFecharDetalhe = () => {
    setDetalhe(null);
  };

  return (
    <div style={{ background: '#121212', color: '#fff', borderRadius: 10, padding: 24, minHeight: 400 }}>
      <h2 style={{ color: '#00bcd4' }}>Vendas</h2>
      {erro && <p style={{ color: '#e53935', fontWeight: 'bold' }}>{erro}</p>}
      {loading ? spinner : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>Cliente</th>
              <th style={thtd}>Data</th>
              <th style={thtd}>Produtos</th>
              <th style={thtd}></th>
            </tr>
          </thead>
          <tbody>
            {vendas.map(venda => (
              <tr key={venda._id} style={trHover}>
                <td style={thtd}>{venda.nomeCliente}</td>
                <td style={thtd}>{new Date(venda.data).toLocaleDateString()}</td>
                <td style={thtd}>{venda.produtos.length}</td>
                <td style={thtd}>
                  <button onClick={() => handleDetalhe(venda)} style={btnPrimary}>Ver detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {detalhe && (
        <div style={{ border: '1px solid #00bcd4', borderRadius: 8, padding: 20, marginTop: 20, background: '#181818', color: '#fff', maxWidth: 500 }}>
          <h3 style={{ color: '#00bcd4' }}>Detalhes da Venda</h3>
          <p><strong>Cliente:</strong> {detalhe.nomeCliente}</p>
          <p><strong>Data:</strong> {new Date(detalhe.data).toLocaleDateString()}</p>
          <h4>Produtos:</h4>
          <ul>
            {detalhe.produtos.map((p, i) => (
              <li key={i}>{p.nome} - Qtd: {p.quantidade} - R$ {Number(p.preco).toFixed(2)}</li>
            ))}
          </ul>
          <button onClick={handleFecharDetalhe} style={btn}>Fechar</button>
        </div>
      )}
    </div>
  );
};

export default VendasAdmin; 