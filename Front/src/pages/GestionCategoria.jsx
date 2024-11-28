import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormCategoria from "../components/FormCategoria";
import "../styles/GestionCategoria.css";
import { useAuth } from "../auth/authContext";

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const { sesion } = useAuth();

  const fetchCategorias = async () => {
    const response = await fetch("http://localhost:3000/categorias");
    if (response.ok) {
      const data = await response.json();
      const categoriasFiltradas = data.categorias.filter(
        (cat) => cat.inhabilitado == 0
      );
      setCategorias(categoriasFiltradas);
    }
  };
  
  useEffect(() => {
    fetchCategorias();
  }, []);

  const agregarCategoria = async (nuevaCategoria) => {
    const response = await fetch("http://localhost:3000/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesion.token}`,
      },
      body: JSON.stringify({ descripcion: nuevaCategoria }),
    });
    if (response.ok) {
      fetchCategorias()
    } else {
      const { errores } = await response.json();
      setError(errores);
    }
  };

  const editarCategoria = async (id, descripcion) => {
    const response = await fetch(`http://localhost:3000/categorias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesion.token}`,
      },
      body: JSON.stringify({ descripcion }),
    });
    if (response.ok) {
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id_categoria === id ? { ...cat, descripcion } : cat
        )
      );
      setModoEdicion(false);
      setCategoriaSeleccionada(null);
    } else {
      const { errores } = await response.json();
      setError(errores);
    }
  };

  const eliminarCategoria = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      const response = await fetch(`http://localhost:3000/categorias/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sesion.token}`,
        },
      });
      if (response.ok) {
        setCategorias(categorias.filter((cat) => cat.id_categoria !== id));
      }
    }
  };

  return (
    <div className='gestionCategorias'>
      <h2>Gestión de Categorías</h2>
      <FormCategoria
        errores={error}
        onGuardar={(descripcion) => {
          modoEdicion
          ? editarCategoria(categoriaSeleccionada.id_categoria, descripcion)
          : agregarCategoria(descripcion);
          setError('');
        }}
        categoria={modoEdicion ? categoriaSeleccionada : null}
        tipoEntidad="categoria"
        onCancel={() => {
          navigate(-1);
          setModoEdicion(false);
          setCategoriaSeleccionada(null);
        }}
      />
      <ul className='formContainer ul-categoria'>
        {categorias.map((cat) => (
          <li key={cat.id_categoria} className='formGroup'>
            {cat.descripcion}
            <button
              onClick={() => {
                setCategoriaSeleccionada(cat);
                setModoEdicion(true);
                setError('');
              }}
              className='saveButton button-categoria'
            >
              Editar
            </button>
            <button onClick={() => eliminarCategoria(cat.id_categoria)} className='cancelButton button-categoria'>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionCategorias;
