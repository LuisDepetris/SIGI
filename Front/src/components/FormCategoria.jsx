import React, { useState, useEffect } from 'react';
import styles from '../styles/Formulario.module.css';
import { useNavigate } from 'react-router-dom';

const FormCategoria = ({ onGuardar, categoria, errores, tipoEntidad, pagos }) => {
  const [descripcion, setDescripcion] = useState( categoria ? categoria.descripcion : pagos ? pagos.descripcion : '');
  const navigate = useNavigate()
  

  useEffect(() => {
    if (categoria) {
      setDescripcion(categoria.descripcion);
    } else if (pagos){
      setDescripcion(pagos.descripcion)
    }
  }, [categoria,pagos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(descripcion);
    setDescripcion('');
  };

  const labelTitulo = tipoEntidad === 'categoria' 
    ? (categoria ? 'Editar Categoría' : 'Agregar Nueva Categoría') 
    : (pagos ? 'Editar Forma de Pago' : 'Agregar Nueva Forma de Pago');

  const botonTexto = tipoEntidad === 'categoria' 
    ? (categoria ? 'Guardar Cambios' : 'Agregar Categoría') 
    : (pagos ? 'Guardar Cambios' : 'Agregar Forma de Pago');

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGroup}>
      <label>{labelTitulo}</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        {errores.descripcion && <div style={{color: "red"}}>{errores.descripcion.msg}</div>}
      </div>
      <div className={styles.buttonGroup}>
        <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>Salir</button>
        <button type="submit" className={styles.saveButton}>
          {botonTexto}
        </button>
      </div>
    </form>
  );
};

export default FormCategoria;
