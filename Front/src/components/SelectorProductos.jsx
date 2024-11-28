import React, { useState, useEffect } from "react";
import Select from "react-select";

function SelectorProductos({ value, onChange }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Cargar productos desde el backend
  const cargarProductos = async (busqueda = "") => {
    setCargando(true);
    try {
      const respuesta = await fetch(
        `http://localhost:3000/productos?search=${busqueda}&limit=10`
      );
      if (!respuesta.ok) {
        throw new Error("Error al cargar productos");
      }

      const data = await respuesta.json();
      const opciones = data.productos.map((producto) => ({
        value: producto.id_producto,
        label: producto.nombre_producto,
      }));
      setProductos(opciones);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError("No se pudieron cargar los productos.");
    } finally {
      setCargando(false);
    }
  };

  // Manejo de búsqueda
  const manejarBusqueda = (inputValue) => {
    cargarProductos(inputValue);
  };

  useEffect(() => {
    cargarProductos(); // Cargar productos iniciales
  }, []);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <Select
        options={productos}
        value={productos.find((p) => p.value === value) || null}
        onChange={
          (selectedOption) => onChange(selectedOption?.value || null) // Enviar el ID seleccionado al padre
        }
        onInputChange={manejarBusqueda} // Manejar búsqueda dinámica
        placeholder={cargando ? "Cargando productos..." : "Buscar producto..."}
        isSearchable={true}
        noOptionsMessage={() =>
          cargando ? "Cargando productos..." : "No se encontraron productos"
        }
      />
    </div>
  );
}

export default SelectorProductos;
