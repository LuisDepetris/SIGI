import React from 'react';
import Menu from '../components/Menu';
import '../styles/Ventas.css';

function Ventas() {
  return (
    <div className="ventas">
      <Menu />
      <div className="contenido">
        <h2>Ventas</h2>
        <p>ventana de Ventas.</p>
      </div>
    </div>
  );
}

export default Ventas;