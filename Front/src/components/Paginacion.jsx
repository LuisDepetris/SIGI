import React, { useState } from "react";
import "../styles/Paginacion.css";

const Paginacion = ({
  paginaActual,
  totalPaginas,
  onPaginaChange,
  onLimitChange,
  registrosVisibles,
}) => {
  const paginas = Array.from({ length: totalPaginas }, (_, index) => index + 1);

  const [limiteSeleccionado, setLimiteSeleccionado] = useState(10);

  const handleLimitChange = (e) => {
    const nuevoLimite = parseInt(e.target.value);
    setLimiteSeleccionado(nuevoLimite);
    onLimitChange(nuevoLimite);
  };

  return (
    <div className="paginacion">
      <button
        onClick={() => onPaginaChange(paginaActual - 1)}
        disabled={paginaActual === 1}
      >
        Anterior
      </button>

      {paginas.map((numeroPagina) => (
        <button
          key={numeroPagina}
          onClick={() => onPaginaChange(numeroPagina)}
          className={paginaActual === numeroPagina ? "activo" : ""}
        >
          {numeroPagina}
        </button>
      ))}

      <button
        onClick={() => onPaginaChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      >
        Siguiente
      </button>

      <select
        className="selector-limite"
        value={limiteSeleccionado}
        onChange={handleLimitChange}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <span className="registros-info">({registrosVisibles})</span>
    </div>
  );
};

export default Paginacion;
