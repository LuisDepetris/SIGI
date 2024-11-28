import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/DetalleVentas.css";
import { useAuth } from "../auth/authContext";

function DetalleVentas() {
  const { id } = useParams();
  const { sesion } = useAuth();
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [formasPago, setFormasPago] = useState([]);
  const [editando, setEditando] = useState(false);
  const [formaPagoSeleccionada, setFormaPagoSeleccionada] = useState("");
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const obtenerDetalleVenta = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:3000/ventas/${id}/ventas_producto`
        );

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
        }

        const data = await respuesta.json();
        setVenta(data.ventaYProductos);
        setProductos(data.ventaYProductos.productos);
      } catch (error) {
        console.error("Error al obtener los detalles de la venta:", error);
        setError("No se pudo cargar la información de la venta.");
      }
    };
    obtenerDetalleVenta();
  }, [editando]);

  const handleVolver = () => {
    navigate("/ventas");
  };

  const handleEditar = () => {
    navigate("/EditarProductoVentas", { state: { venta } });
  };

  return (
    <div className="detalle-ventas">
      {error && <p className="error">{error}</p>}
      {venta ? (
        <>
          <h2>Detalle de Venta #{venta.idVenta}</h2>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(venta.fecha).toLocaleDateString("es-ES")}
          </p>
          <p>
            <strong>Total de Venta:</strong> ${venta.ventaTotal}
          </p>
          <div>
            <strong>Forma de Pago:</strong>
            {editando ? (
              <select value={formaPagoSeleccionada} onChange={elegirMedioPago}>
                <option value="">Seleccione una Opción</option>
                {formasPago.map((forma) => (
                  <option key={forma.id_forma_pago} value={forma.id_forma_pago}>
                    {forma.descripcion}
                  </option>
                ))}
                <option value={-1}>Agregar nueva Forma de Pago</option>
              </select>
            ) : (
              <p>{venta.formaPago}</p>
            )}
          </div>
          <p>
            <strong>Cantidad Total:</strong> {venta.cantidadTotal}
          </p>

          <h3>Productos</h3>
          <table className="productos-tabla">
            <thead>
              <tr>
                <th>ID Producto</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.idProducto}>
                  <td>{producto.idProducto}</td>
                  <td>{producto.nombreProducto}</td>
                  <td>${producto.precioFinal}</td>
                  <td>{producto.cantidad}</td>
                  <td>${producto.subTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="botones-edicion" onClick={handleVolver}>
            Volver a Ventas
          </button>

          <button className="botones-edicion" onClick={handleEditar}>
            Editar Venta
          </button>
        </>
      ) : (
        <p>Cargando detalles de la venta...</p>
      )}
    </div>
  );
}

export default DetalleVentas;
