import React from "react";

export default function ModalConfirmDelete({ open, onClose, onConfirm, productName }) {
  if (!open) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2 style={{ color: '#fff' }}>Confirmar Exclusão</h2>
        <p style={{ color: '#fff' }}>Tem certeza que deseja excluir <b>{productName}</b>?</p>
        <div style={styles.actions}>
          <button style={styles.cancel} onClick={onClose}>Cancelar</button>
          <button style={styles.confirm} onClick={onConfirm}>Sim, excluir</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#222',
    color: '#fff',
    padding: '2rem 2.5rem',
    borderRadius: 10,
    minWidth: 320,
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  actions: {
    marginTop: '1.5rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  cancel: {
    padding: '0.5rem 1.2rem',
    borderRadius: 6,
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    background: '#444',
    color: '#fff',
    transition: 'background 0.2s',
  },
  confirm: {
    padding: '0.5rem 1.2rem',
    borderRadius: 6,
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    background: '#f44336',
    color: '#fff',
    transition: 'background 0.2s',
  },
}; 