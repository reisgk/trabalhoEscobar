import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import ModalConfirmDelete from '../components/ModalConfirmDelete';
import { FaEdit, FaTrash } from 'react-icons/fa';

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

const input = { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6, padding: 8, marginRight: 8 };
const select = { ...input, minWidth: 120 };
const tableStyle = { width: '100%', maxWidth: 900, background: '#181818', color: '#fff', borderCollapse: 'collapse', borderRadius: 8, overflow: 'hidden', marginTop: 10 };
const thtd = { border: '1px solid #333', padding: 10 };
const trHover = { background: '#222' };

const ProdutosAdmin = () => {
  const { token, usuario } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nome: '', quantidade: 1, preco: '', categoria: '', descricao: '', imagem: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [confirmar, setConfirmar] = useState(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProdutos();
      fetchCategorias();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/produtos/${usuario}/`, { headers: { Authorization: `Bearer ${token}` } });
      setProdutos(res.data);
    } catch (err) {
      setErro('Erro ao buscar produtos.');
    }
    setLoading(false);
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get('/categorias', { headers: { Authorization: `Bearer ${token}` } });
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setCategorias([]);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);
    try {
      if (editId) {
        await api.put('/produtos', { id: editId, ...form, preco: Number(form.preco), quantidade: Number(form.quantidade) }, { headers: { Authorization: `Bearer ${token}` } });
        setSucesso('Produto atualizado com sucesso!');
      } else {
        await api.post('/produtos', { ...form, preco: Number(form.preco), quantidade: Number(form.quantidade) }, { headers: { Authorization: `Bearer ${token}` } });
        setSucesso('Produto adicionado com sucesso!');
      }
      setForm({ nome: '', quantidade: 1, preco: '', categoria: '', descricao: '', imagem: '' });
      setEditId(null);
      fetchProdutos();
    } catch (err) {
      setErro('Erro ao salvar produto.');
    }
    setLoading(false);
    setTimeout(() => setSucesso(''), 2000);
  };

  const handleEdit = (prod) => {
    setForm({
      nome: prod.nome,
      quantidade: prod.quantidade,
      preco: prod.preco,
      categoria: prod.categoria || '',
      descricao: prod.descricao,
      imagem: prod.imagem
    });
    setEditId(prod._id);
    setShowForm(true);
  };

  const handleDelete = (prod) => {
    setConfirmar(prod._id);
    setProdutoParaExcluir(prod);
  };

  const confirmarDelete = async () => {
    if (!confirmar) return;
    setLoading(true);
    setErro('');
    setSucesso('');
    try {
      await api.delete('/produtos', { data: { id: confirmar }, headers: { Authorization: `Bearer ${token}` } });
      setSucesso('Produto excluído com sucesso!');
      fetchProdutos();
    } catch (err) {
      setErro('Erro ao excluir produto.');
    }
    setLoading(false);
    setConfirmar(null);
    setProdutoParaExcluir(null);
    setTimeout(() => setSucesso(''), 2000);
  };

  return (
    <div style={{ background: '#121212', color: '#fff', borderRadius: 10, padding: 24, minHeight: 400 }}>
      <h2 style={{ color: '#00bcd4' }}>Produtos</h2>
      <button
        style={{ ...btnPrimary, fontSize: 16, padding: '10px 24px', marginBottom: 18, marginLeft: 0 }}
        onClick={() => { setShowForm(true); setEditId(null); setForm({ nome: '', quantidade: 1, preco: '', categoria: '', descricao: '', imagem: '' }); }}
        disabled={showForm && !editId}
      >
        Cadastrar novo produto
      </button>
      {showForm && (
        <div style={{
          background: '#232323',
          borderRadius: 14,
          boxShadow: '0 2px 12px #0003',
          padding: 28,
          maxWidth: 520,
          margin: '0 auto 32px auto',
          marginTop: 18,
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ fontWeight: 600, marginBottom: 2 }}>Nome do produto</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome do produto"
              required
              disabled={loading}
              style={{ ...input, width: '100%', marginRight: 0 }}
            />
            <label style={{ fontWeight: 600, marginBottom: 2 }}>Quantidade</label>
            <input
              type="number"
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              placeholder="Quantidade"
              min={1}
              required
              disabled={loading}
              style={{ ...input, width: '100%', marginRight: 0 }}
            />
            <label style={{ fontWeight: 600, marginBottom: 2 }}>Preço</label>
            <input
              type="number"
              name="preco"
              value={form.preco}
              onChange={handleChange}
              placeholder="Preço"
              min={0}
              step={0.01}
              required
              disabled={loading}
              style={{ ...input, width: '100%', marginRight: 0 }}
            />
            <label style={{ fontWeight: 600, marginBottom: 2 }}>Categoria</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ ...select, width: '100%', marginRight: 0 }}
            >
              <option value="">Selecione a categoria</option>
              {(Array.isArray(categorias) ? categorias : []).map(cat => (
                <option key={cat._id} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>
            <label style={{ fontWeight: 600, marginBottom: 2 }}>Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descrição do produto"
              required
              disabled={loading}
              style={{ ...input, width: '100%', minHeight: 60, resize: 'vertical', marginRight: 0 }}
            />
            <label style={{ fontWeight: 600, marginBottom: 2 }}>URL da imagem</label>
            <input
              type="text"
              name="imagem"
              value={form.imagem}
              onChange={handleChange}
              placeholder="URL da imagem"
              required
              disabled={loading}
              style={{ ...input, width: '100%', marginRight: 0 }}
            />
            {form.imagem && (
              <div style={{ margin: '10px 0', textAlign: 'center' }}>
                <img src={form.imagem} alt="Preview" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, background: '#fff', padding: 4, boxShadow: '0 1px 6px #0002' }} onError={e => e.target.style.display='none'} />
              </div>
            )}
            {erro && <div style={{ color: '#e53935', fontWeight: 700, background: '#2d1818', borderRadius: 6, padding: 8, marginTop: 4 }}>{erro}</div>}
            {sucesso && <div style={{ color: '#00bcd4', fontWeight: 700, background: '#18343a', borderRadius: 6, padding: 8, marginTop: 4 }}>{sucesso}</div>}
            <button type="submit" style={{ ...btnPrimary, fontSize: 18, padding: '12px 0', marginTop: 8 }} disabled={loading}>
              {loading ? 'Salvando...' : (editId ? 'Salvar Alterações' : 'Cadastrar Produto')}
            </button>
            <button type="button" style={{ ...btnDanger, fontSize: 16, padding: '8px 0', marginTop: 4 }} onClick={() => { setEditId(null); setForm({ nome: '', quantidade: 1, preco: '', categoria: '', descricao: '', imagem: '' }); setShowForm(false); }}>
              Cancelar
            </button>
          </form>
        </div>
      )}
      {loading ? spinner : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>Nome</th>
              <th style={thtd}>Qtd</th>
              <th style={thtd}>Preço</th>
              <th style={thtd}>Categoria</th>
              <th style={thtd}>Descrição</th>
              <th style={thtd}>Imagem</th>
              <th style={thtd}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(prod => (
              <tr key={prod._id} style={trHover}>
                <td style={thtd}>{prod.nome}</td>
                <td style={thtd}>{prod.quantidade}</td>
                <td style={thtd}>R$ {Number(prod.preco).toFixed(2)}</td>
                <td style={thtd}>{prod.categoria}</td>
                <td style={thtd}>{prod.descricao}</td>
                <td style={thtd}><img src={prod.imagem} alt={prod.nome} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /></td>
                <td style={thtd}>
                  <button onClick={() => handleEdit(prod)} style={btnPrimary}><FaEdit /></button>{' '}
                  <button onClick={() => handleDelete(prod)} style={btnDanger}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ModalConfirmDelete
        open={!!confirmar}
        onClose={() => { setConfirmar(null); setProdutoParaExcluir(null); }}
        onConfirm={confirmarDelete}
        productName={produtoParaExcluir?.nome || ''}
      />
    </div>
  );
};

export default ProdutosAdmin; 