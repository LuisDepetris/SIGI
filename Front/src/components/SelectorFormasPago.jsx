import React, { useEffect, useState } from "react";

function SelectorFormasPago({ value, onChange, agregarNuevaFormaPago }) {
  const [formasPago, setFormasPago] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerFormasPago = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3000/pagos`);

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
        }

        const data = await respuesta.json();
        setFormasPago(data.formasPago);
      } catch (error) {
        console.error("Error al obtener las formas de pago:", error);
        setError("No se pudo cargar la información de las formas de pago.");
      }
    };

    obtenerFormasPago();
  }, []);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <select
        value={value || ""} // Si value es null o undefined, usa ""
        onChange={onChange}
      >
        <option value="">Seleccione una Opción</option>
        {formasPago.map((forma) => (
          <option key={forma.id_forma_pago} value={forma.id_forma_pago}>
            {forma.descripcion}
          </option>
        ))}
        {agregarNuevaFormaPago && (
          <option value={-1}>Agregar nueva Forma de Pago</option>
        )}
      </select>
    </div>
  );
}

export default SelectorFormasPago;
