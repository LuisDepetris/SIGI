import React, { useEffect, useState } from "react";
import Select from "react-select";

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
        // Formatear los productos para React-Select
        const opciones = data.productos.map((producto) => ({
          value: producto.id_producto,
          label: producto.nombre_producto,
        }));
        setProductos(opciones);
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
      <Select
        options={productos}
        value={productos.find((p) => p.value === value) || null}
        onChange={(selectedOption) => onChange(selectedOption?.value || "")}
        placeholder="Buscar producto..."
        isSearchable={true}
        noOptionsMessage={() => "No se encontraron productos"}
      />
    </div>
  );
}

export default SelectorProductos;
