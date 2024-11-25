import React, { useState, useEffect } from 'react';
import styles from '../styles/Formulario.module.css';
import { useNavigate } from 'react-router-dom';

const FormCategoria = ({ onGuardar, categoria, errores }) => {
  const [descripcion, setDescripcion] = useState(categoria ? categoria.descripcion : '');
  const navigate = useNavigate()
  


  useEffect(() => {
    if (categoria) {
      setDescripcion(categoria.descripcion);
    }
  }, [categoria]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(descripcion);
    setDescripcion('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label>{categoria ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</label>
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
          {categoria ? 'Guardar Cambios' : 'Agregar Categoría'}
        </button>
      </div>
    </form>
  );
};

export default FormCategoria;
