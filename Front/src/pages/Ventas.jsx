import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paginacion from "../components/Paginacion";
import React from "react";
import "../styles/Ventas.css";
import { useAuth } from "../auth/authContext";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [limite, setLimite] = useState(10);
  const { sesion } = useAuth();
  const navigate = useNavigate();
  const totalPaginas = Math.ceil(totalVentas / limite);
  const registrosInicio = totalVentas > 0 ? (paginaActual - 1) * limite + 1 : 0;
  const registrosFin =
    totalVentas > 0 ? Math.min(paginaActual * limite, totalVentas) : 0;

  useEffect(() => {
    const traerVentas = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:3000/ventas?offset=${
            (paginaActual - 1) * limite
          }&limit=${limite}`
        );

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
        }

        const data = await respuesta.json();

        setVentas(data.ventas);
        setTotalVentas(data.paginacion.total || 0);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
        alert("No se pudo obtener las ventas");
      }
    };

    traerVentas();
  }, [paginaActual, limite]);

  const handleAgregar = () => {
    navigate("/agregarProductoventas");
  };

  const handleFormaPago = () => {
    navigate("/GestionFormPagos");
  };

  const handleVerDetalles = (id) => {
    navigate(`/ventas/${id}`);
  };

  const handleBorrar = async (id) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar la venta con ID ${id}?`
    );
    if (!confirmacion) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/ventas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sesion.token}`,
        },
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
      }

      setVentas(ventas.filter((venta) => venta.id_venta !== id));

      alert("Venta eliminada correctamente.");
    } catch (error) {
      alert(`No se pudo eliminar la venta: ${error || "Error desconocido"}`);
    }
  };

  const handleLimitChange = (num) => {
    setLimite(num);
    setPaginaActual(1);
  };

  const sumaTotalVentas = ventas.reduce(
    (total, venta) => total + parseFloat(venta.venta_total),
    0
  );

  return (
    <div className="ventas">
      <div className="header-ventas">
        <h2>Ventas</h2>
        <button className="btn-nuevo" onClick={handleAgregar}>
          Añadir Venta
        </button>
        <button className="btn-nuevo" onClick={handleFormaPago}>
          Formas de Pago
        </button>
      </div>

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPaginaChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
        registrosVisibles={`Registros ${registrosInicio}-${registrosFin} de ${totalVentas}`}
        onLimitChange={handleLimitChange}
      />

      <table className="ventas-tabla">
        <thead>
          <tr>
            <th></th>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Cantidad de Productos</th>
            <th>Total Venta</th>
            <th>Forma de Pago</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length > 0 ? (
            ventas.map((venta) => (
              <tr key={venta.id_venta}>
                <td>
                  <button
                    className="btn-detalles"
                    onClick={() => handleVerDetalles(venta.id_venta)}
                  >
                    🔍
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleBorrar(venta.id_venta)}
                  >
                    🗑️
                  </button>
                </td>
                <td>{venta.id_venta}</td>
                <td>{new Date(venta.fecha).toLocaleDateString("es-ES")}</td>
                <td>{venta.cantidad_total}</td>
                <td>${parseFloat(venta.venta_total).toFixed(2)}</td>
                <td>{venta.forma_pago}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No se encontraron ventas</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="total-ventas">
        <h3>Total de Ventas: ${sumaTotalVentas.toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default Ventas;
