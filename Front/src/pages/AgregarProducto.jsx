import React from 'react';
import { useNavigate } from 'react-router-dom';
import Formulario from '../components/Formulario';
import styles from '../styles/DetalleProducto.module.css';

const AgregarProducto = () => {
  const navigate = useNavigate();

  const handleGuardar = (producto) => {
    alert(`Producto ${producto.nombreProducto} agregado con éxito!`);
    navigate(`/productos`);
  };

  const handleCancelar = () => {
    navigate(`/productos`);
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Agregar Producto Nuevo</h2>
      <Formulario onGuardar={handleGuardar} onCancelar={handleCancelar} />
    </div>
  );
};

export default AgregarProducto;
