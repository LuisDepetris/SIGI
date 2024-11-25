import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormCategoria from "../components/FormCategoria";
import styles from "../styles/GestionCategoria.module.css";

const GestionFormPagos = () => {
  const [formasPago, setFormasPago] = useState([]);
  const [formaSeleccionada, setFormaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const fetchPagos = async () => {
    const response = await fetch("http://localhost:3000/Pagos");
    if (response.ok) {
      const data = await response.json();
      const formasFiltradas = data.formasPago.filter(
        (pago) => pago.inhabilitado == 0
      );
      setFormasPago(formasFiltradas);
    }
  };
  
  useEffect(() => {
    fetchPagos();
  }, []);

  const agregarFormaPago = async (nuevaFormaPago) => {
    const response = await fetch("http://localhost:3000/Pagos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion: nuevaFormaPago }),
    });
    if (response.ok) {
      fetchPagos()
    } else {
      const { errores } = await response.json();
      setError(errores);
    }
  };

  const editarFormaPago = async (id, descripcion) => {
    const response = await fetch(`http://localhost:3000/Pagos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion }),
    });
    if (response.ok) {
      setFormasPago((prev) =>
        prev.map((pago) =>
          pago.id_forma_pago === id ? { ...pago, descripcion } : pago
        )
      );
      setModoEdicion(false);
      setFormaSeleccionada(null);
    }
  };

  const eliminarFormaPago = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta forma de pago?")) {
      const response = await fetch(`http://localhost:3000/Pagos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFormasPago(formasPago.filter((cat) => cat.id_forma_pago !== id));
      }
    }
  };

  return (
    <div className={styles.gestionCategorias}>
      <h2>Gestión de Formas de Pago</h2>
      <FormCategoria
        errores={error}
        onGuardar={(descripcion) => {
          modoEdicion
            ? editarFormaPago(formaSeleccionada.id_forma_pago, descripcion)
            : agregarFormaPago(descripcion);
        }}
        pagos={modoEdicion ? formaSeleccionada : null}
        tipoEntidad="pago"
        onCancel={() => {
          navigate(-1);
          setModoEdicion(false);
          setFormaSeleccionada(null);
        }}
      />
      <ul className={styles.formContainer}>
        {formasPago.map((pago) => (
          <li key={pago.id_forma_pago} className={styles.formGroup}>
            {pago.descripcion}
            <button
              onClick={() => {
                setFormaSeleccionada(pago);
                setModoEdicion(true);
              }}
              className={styles.saveButton}
            >
              Editar
            </button>
            <button onClick={() => eliminarFormaPago(pago.id_forma_pago)} className={styles.cancelButton}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionFormPagos;
