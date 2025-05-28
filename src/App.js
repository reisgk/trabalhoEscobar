import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Produto from './pages/Produto';
import Carrinho from './pages/Carrinho';
import FinalizarCompra from './pages/FinalizarCompra';
import Agradecimento from './pages/Agradecimento';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Registrar from './pages/Registrar';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#181818' }}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produto/:id" element={<Produto />} />
              <Route path="/carrinho" element={<Carrinho />} />
              <Route path="/finalizar" element={<FinalizarCompra />} />
              <Route path="/obrigado" element={<Agradecimento />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<Registrar />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
