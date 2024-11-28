import React, { useEffect, useState } from "react";

function SelectorProductos({ value, onChange }) {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/productos");

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
        }

        const data = await respuesta.json();
        setProductos(data.productos);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("No se pudieron cargar los productos.");
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <select value={value} onChange={onChange}>
        <option value="">Seleccione un producto</option>
        {productos.map((producto) => (
          <option key={producto.id_producto} value={producto.id_producto}>
            {producto.nombre_producto}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectorProductos;
