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
const tableStyle = { width: '100%', maxWidth: 600, background: '#181818', color: '#fff', borderCollapse: 'collapse', borderRadius: 8, overflow: 'hidden', marginTop: 10 };
const thtd = { border: '1px solid #333', padding: 10 };
const trHover = { background: '#222' };

const CategoriasAdmin = () => {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [confirmar, setConfirmar] = useState(null);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null);

  useEffect(() => {
    if (token) {
      fetchCategorias();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categorias', { headers: { Authorization: `Bearer ${token}` } });
      setCategorias(res.data);
    } catch (err) {
      setErro('Erro ao buscar categorias.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);
    try {
      if (editId) {
        await api.put('/categorias', { id: editId, nome_categoria: nome }, { headers: { Authorization: `Bearer ${token}` } });
        setSucesso('Categoria atualizada com sucesso!');
      } else {
        await api.post('/categorias', { nome_categoria: nome }, { headers: { Authorization: `Bearer ${token}` } });
        setSucesso('Categoria adicionada com sucesso!');
      }
      setNome('');
      setEditId(null);
      fetchCategorias();
    } catch (err) {
      setErro('Erro ao salvar categoria.');
    }
    setLoading(false);
    setTimeout(() => setSucesso(''), 2000);
  };

  const handleEdit = (cat) => {
    setNome(cat.nome);
    setEditId(cat._id);
  };

  const handleDelete = (cat) => {
    setConfirmar(cat._id);
    setCategoriaParaExcluir(cat);
  };

  const confirmarDelete = async () => {
    if (!confirmar) return;
    setLoading(true);
    setErro('');
    setSucesso('');
    try {
      await api.delete('/categorias', { data: { id: confirmar }, headers: { Authorization: `Bearer ${token}` } });
      setSucesso('Categoria excluída com sucesso!');
      fetchCategorias();
    } catch (err) {
      setErro('Erro ao excluir categoria.');
    }
    setLoading(false);
    setConfirmar(null);
    setCategoriaParaExcluir(null);
    setTimeout(() => setSucesso(''), 2000);
  };

  return (
    <div style={{ background: '#121212', color: '#fff', borderRadius: 10, padding: 24, minHeight: 400 }}>
      <h2 style={{ color: '#00bcd4' }}>Categorias</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome da categoria"
          required
          disabled={loading}
          style={input}
        />
        <button type="submit" disabled={loading} style={loading ? btnDisabled : btnPrimary}>
          {editId ? 'Atualizar' : 'Adicionar'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setNome(''); setEditId(null); }} style={btn}>
            Cancelar
          </button>
        )}
      </form>
      {erro && <p style={{ color: '#e53935', fontWeight: 'bold' }}>{erro}</p>}
      {sucesso && <p style={{ color: '#00bcd4', fontWeight: 'bold' }}>{sucesso}</p>}
      {loading ? spinner : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>Nome</th>
              <th style={thtd}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(cat => (
              <tr key={cat._id} style={trHover}>
                <td style={thtd}>{cat.nome}</td>
                <td style={thtd}>
                  <button onClick={() => handleEdit(cat)} style={btnPrimary}><FaEdit /></button>{' '}
                  <button onClick={() => handleDelete(cat)} style={btnDanger}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ModalConfirmDelete
        open={!!confirmar}
        onClose={() => { setConfirmar(null); setCategoriaParaExcluir(null); }}
        onConfirm={confirmarDelete}
        productName={categoriaParaExcluir?.nome || ''}
      />
    </div>
  );
};

export default CategoriasAdmin; 