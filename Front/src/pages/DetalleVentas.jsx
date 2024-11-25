import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DetalleVentas.css";

function DetalleVentas() {
  const { id } = useParams();
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
  }, []);

  useEffect(() => {
    const obetenerFormasPago = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3000/pagos`);

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
        }

        const data = await respuesta.json();
        setFormasPago(data.formasPago[0]);
      } catch (error) {
        console.error("Error al obtener las forams de pago:", error);
        setError("No se pudo cargar la información de las formas de pago.");
      }
    };

    obetenerFormasPago();
  }, []);

  const handleBorrar = async (
    idVentaProducto,
    idProducto,
    cantidad,
    ventaSubTotal
  ) => {
    if (productos.length === 1) {
      alert("No puedes eliminar el único producto de la venta.");
      return;
    }

    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar el producto?`
    );
    if (!confirmacion) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3000/ventas/${id}/ventas_producto/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idVentaProducto: idVentaProducto,
            idProducto: idProducto,
            cantidad: cantidad,
            ventaSubTotal: ventaSubTotal,
          }),
        }
      );

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
      }

      const productosActualizados = productos.filter(
        (producto) => producto.idProducto !== idProducto
      );

      const nuevoTotal = productosActualizados.reduce(
        (ac, current) => ac + parseInt(current.subTotal),
        0
      );

      const nuevaCantidadTotal = productosActualizados.reduce(
        (ac, current) => ac + current.cantidad,
        0
      );

      setProductos(productosActualizados);

      setVenta({
        ...venta,
        ventaTotal: parseFloat(nuevoTotal),
        cantidadTotal: nuevaCantidadTotal,
      });

      handleGuardar(
        id,
        parseFloat(nuevoTotal),
        nuevaCantidadTotal,
        venta.idFormaPago
      );

      setEliminando(true);

      alert("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      alert("No se pudo eliminar la venta.");
    }
  };

  const handleVolver = () => {
    navigate("/ventas");
  };

  const handleEditar = () => {
    alert("Usted esta habilitado para editar los registros");
    setEditando(true);
  };

  const handleGuardar = async (id, ventaTotal, cantidadTotal, idFormaPago) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/ventas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ventaTotal: ventaTotal,
          cantidadTotal: cantidadTotal,
          idFormaPago: idFormaPago,
        }),
      });
      console.log(`${idFormaPago}`);
      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
      }

      if (!editando) {
        alert("Venta modificada con éxito");
        navigate("/ventas", { replace: true });
      }
    } catch (error) {
      console.error("Error al modificar la venta:", error);
      alert("No se pudo modificar la venta.");
    }
  };

  const handleAgregar = () => {
    navigate("/agregarProductoVentas");
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
              <select
                value={formaPagoSeleccionada}
                onChange={(e) => setFormaPagoSeleccionada(e.target.value)}
              >
                <option value="">Seleccione una Opción</option>
                {formasPago.map((forma) => (
                  <option key={forma.id_forma_pago} value={forma.id_forma_pago}>
                    {forma.descripcion}
                  </option>
                ))}
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
                <th></th>
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
                  <td>
                    <button
                      className="btn-eliminar"
                      disabled={!editando}
                      onClick={() =>
                        handleBorrar(
                          producto.idVentaProducto,
                          producto.idProducto,
                          producto.cantidad,
                          producto.subTotal
                        )
                      }
                    >
                      🗑️
                    </button>
                  </td>
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
            Editar
          </button>
          <button
            className="botones-edicion"
            disabled={!editando || !formaPagoSeleccionada}
            onClick={() =>
              handleGuardar(
                venta.idVenta,
                venta.ventaTotal,
                venta.cantidadTotal,
                formaPagoSeleccionada
              )
            }
          >
            Guardar
          </button>
          <button
            className="botones-edicion"
            disabled={!editando}
            onClick={handleAgregar}
          >
            + Productos
          </button>
        </>
      ) : (
        <p>Cargando detalles de la venta...</p>
      )}
    </div>
  );
}

export default DetalleVentas;
