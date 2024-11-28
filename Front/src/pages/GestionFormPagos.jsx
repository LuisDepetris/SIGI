import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormCategoria from "../components/FormCategoria";
import { useAuth } from "../auth/authContext";
import "../styles/GestionCategoria.css";

const GestionFormPagos = () => {
  const [formasPago, setFormasPago] = useState([]);
  const [formaSeleccionada, setFormaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState({});
  const { sesion } = useAuth();
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
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesion.token}`
      },
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
    } else {
      const { errores } = await response.json();
      setError(errores);
    }
  };

  const eliminarFormaPago = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta forma de pago?")) {
      const response = await fetch(`http://localhost:3000/Pagos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sesion.token}`,
        }
      });
      if (response.ok) {
        setFormasPago(formasPago.filter((cat) => cat.id_forma_pago !== id));
        setError('');
      } else {
        const { error } = await response.json();
        alert(
          `No se pudo eliminar la forma de pago: ${
            error || "Error desconocido"
          }`
        );
        setError('');
      }

    }
  };

  return (
    <div className='gestionCategorias'>
      <h2>Gestión de Formas de Pago</h2>
      <FormCategoria
        errores={error}
        onGuardar={(descripcion) => {
          modoEdicion
            ? editarFormaPago(formaSeleccionada.id_forma_pago, descripcion)
            : agregarFormaPago(descripcion);
            setError('');
        }}
        pagos={modoEdicion ? formaSeleccionada : null}
        tipoEntidad="pago"
        onCancel={() => {
          navigate(-1);
          setModoEdicion(false);
          setFormaSeleccionada(null);
        }}
      />
      <ul className='formContainer ul-categoria'>
        {formasPago.map((pago) => (
          <li key={pago.id_forma_pago} className='formGroup'>
            {pago.descripcion}
            <button
              onClick={() => {
                setFormaSeleccionada(pago);
                setModoEdicion(true);
                setError('');
              }}
              className='saveButton button-categoria'
            >
              Editar
            </button>
            <button onClick={() => eliminarFormaPago(pago.id_forma_pago)} className='cancelButton button-categoria'>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionFormPagos;
