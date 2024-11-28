import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/AgregarProductoVentas.css";
import { useAuth } from "../auth/authContext";
import Ventas from "./Ventas";
import SelectorFormasPago from "../components/SelectorFormasPago";
import SelectorProductos from "../components/SelectorProductos";

function EditarProductoVentas() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const [productosVendidos, setProductosVendidos] = useState([]);
  const { sesion } = useAuth();
  const [productosActualizados, setProductosActualizados] = useState([]);
  const navigate = useNavigate();
  const [formasPago, setFormasPago] = useState([]);
  const [formaPagoSeleccionada, setFormaPagoSeleccionada] = useState("");
  const location = useLocation();
  const { venta } = location.state || {};

  useEffect(() => {
    if (venta && venta.productos) {
      setProductosVendidos(venta.productos);
    }
  }, [venta]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/productos");

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
        }

        const data = await respuesta.json();
        setProductos(data.productos); // Guarda los productos en el estado
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("No se pudieron cargar los productos.");
      }
    };

    obtenerProductos();
  }, []);

  const handleSeleccionarProducto = async (id_producto) => {
    try {
      // Obtener detalles del producto desde el backend
      const respuesta = await fetch(
        `http://localhost:3000/productos/${id_producto}`
      );
      if (!respuesta.ok) {
        throw new Error("Error al obtener los detalles del producto");
      }

      const { producto } = await respuesta.json();

      // Actualizar el estado con los detalles del producto
      setProductoSeleccionado(producto);
      setCantidad(1);
      setError("");
    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
      setError("No se pudieron obtener los detalles del producto.");
    }
  };

  const handleCantidadChange = (e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    setCantidad(nuevaCantidad > 0 ? nuevaCantidad : 1);
  };

  const cantidadTotal = productosVendidos.reduce(
    (acumulador, producto) => acumulador + producto.cantidad,
    0
  );

  const handleVolver = () => {
    navigate("/ventas");
  };

  const ventaTotal = productosVendidos.reduce(
    (ac, current) => ac + parseFloat(current.subTotal),
    0
  );

  const handleGuardar = async (
    idVenta,
    ventaTotal,
    cantidadTotal,
    idFormaPago
  ) => {
    if (idFormaPago === "") {
      idFormaPago = venta.idFormaPago;
    }

    try {
      // Eliminar todos los productos existentes
      const respuestaDelete = await fetch(
        `http://localhost:3000/ventas/${idVenta}/ventas_producto`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sesion.token}`,
          },
        }
      );

      if (!respuestaDelete.ok) {
        const errorData = await respuestaDelete.json();
        throw new Error(
          `Error al eliminar los productos de la venta: ${errorData.error}`
        );
      }

      // Guardar productos en la venta
      for (const producto of productosVendidos) {
        const { idProducto, cantidad, subTotal } = producto;

        const respuestaProductos = await fetch(
          `http://localhost:3000/ventas/${idVenta}/ventas_producto`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sesion.token}`,
            },
            body: JSON.stringify({
              idProducto: idProducto,
              cantidad: cantidad,
              ventaSubTotal: subTotal,
            }),
          }
        );

        if (!respuestaProductos.ok) {
          const errorData = await respuestaProductos.json();
          throw new Error(
            `Error al guardar producto en la venta: ${errorData.error}`
          );
        }
      }

      // Actualizar detalles de la venta
      const respuestaVenta = await fetch(
        `http://localhost:3000/ventas/${idVenta}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sesion.token}`,
          },
          body: JSON.stringify({
            ventaTotal: ventaTotal,
            cantidadTotal: cantidadTotal,
            idFormaPago: idFormaPago,
          }),
        }
      );

      if (!respuestaVenta.ok) {
        const errorData = await respuestaVenta.json();
        throw new Error(
          `Error al actualizar los detalles de la venta: ${errorData.error}`
        );
      }

      alert("Venta y productos guardados con éxito.");
      navigate("/ventas", { replace: true });
    } catch (error) {
      console.error("Error al guardar la venta:", error);
      alert("Ocurrió un error al guardar la venta. Intente nuevamente.");
    }
  };

  const handleAgregarProducto = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      setError("Seleccione un producto y una cantidad válida.");
      return;
    }

    if (cantidad > productoSeleccionado.stock_actual) {
      setError("La cantidad excede el stock disponible.");
      return;
    }

    // Actualizar producto existente o agregar nuevo producto
    const productoIndex = productosVendidos.findIndex(
      (producto) => producto.idProducto === productoSeleccionado.id_producto
    );

    if (productoIndex !== -1) {
      // Si el producto ya existe, actualiza la cantidad y el subtotal
      const productosActualizados = [...productosVendidos];
      productosActualizados[productoIndex] = {
        ...productosActualizados[productoIndex],
        cantidad: productosActualizados[productoIndex].cantidad + cantidad,
        subTotal:
          parseInt(productosActualizados[productoIndex].subTotal) +
          parseInt(productoSeleccionado.precio_final) * cantidad,
      };
      setProductosVendidos(productosActualizados);
    } else {
      // Si el producto no existe, lo agrega como un nuevo registro
      setProductosVendidos([
        ...productosVendidos,
        {
          idProducto: productoSeleccionado.id_producto,
          nombreProducto: productoSeleccionado.nombre_producto,
          precioFinal: productoSeleccionado.precio_final,
          cantidad: cantidad,
          subTotal: parseInt(productoSeleccionado.precio_final) * cantidad,
        },
      ]);
    }
    // Limpiar selección
    setProductoSeleccionado(null);
    setCantidad(1);
    setError(""); // Limpiar errores
  };

  const handleBorrar = (idProducto) => {
    const productosActualizados = productosVendidos.filter(
      (producto) => producto.idProducto !== idProducto
    );
    setProductosVendidos(productosActualizados);
  };

  const elegirMedioPago = (e) => {
    const idActual = parseInt(e.target.value, 10);
    if (idActual === -1) {
      navigate("/GestionFormPagos");
    }
    if (isNaN(idActual)) {
      // Si el valor no es un número válido, restablece el estado
      setFormaPagoSeleccionada("");
    } else {
      setFormaPagoSeleccionada(idActual);
    }
  };

  return (
    <div className="pagina-completa">
      <div className="detalle-ventas">
        <h2>Detalle de Venta #{venta.idVenta}</h2>
        <p>
          <strong>Total de Venta:</strong> ${parseInt(ventaTotal)}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(venta.fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
        <div>
          <strong>Forma de Pago:</strong>
          <SelectorFormasPago
            value={formaPagoSeleccionada || ""}
            onChange={elegirMedioPago}
            agregarNuevaFormaPago={true}
          />
        </div>
        <p>
          <strong>Cantidad Total:</strong> {cantidadTotal}
        </p>
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
            {productosVendidos.map((producto, index) => (
              <tr key={producto.idProducto}>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleBorrar(producto.idProducto)}
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
            {productosVendidos.length === 0 && (
              <tr>
                <td colSpan="6">No hay productos en esta venta.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="agregar-producto">
        <h2>Agregar Producto a Venta</h2>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="select-producto">Producto:</label>
          <SelectorProductos
            value={productoSeleccionado?.id_producto || null}
            onChange={(idProducto) => handleSeleccionarProducto(idProducto)}
          />
        </div>

        {productoSeleccionado && (
          <div className="producto-detalle">
            <h3>Detalles del Producto</h3>
            <p>
              <strong>ID:</strong> {productoSeleccionado.id_producto}
            </p>
            <p>
              <strong>Nombre:</strong> {productoSeleccionado.nombre_producto}
            </p>
            <p>
              <strong>Stock Actual:</strong> {productoSeleccionado.stock_actual}
            </p>
            <p>
              <strong>Precio Final:</strong> $
              {productoSeleccionado.precio_final}
            </p>
          </div>
        )}

        {productoSeleccionado && (
          <div className="form-group">
            <label htmlFor="input-cantidad">Cantidad:</label>
            <input
              id="input-cantidad"
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              min="1"
            />
          </div>
        )}

        <br />
        <button className="btn-guardar" onClick={handleVolver}>
          Volver a Ventas
        </button>
        <button
          className="btn-guardar"
          disabled={!productoSeleccionado || cantidad <= 0}
          onClick={handleAgregarProducto}
        >
          Agregar Producto
        </button>
        <button
          className="btn-guardar"
          disabled={productosVendidos.length === 0}
          onClick={() =>
            handleGuardar(
              venta.idVenta,
              ventaTotal,
              cantidadTotal,
              formaPagoSeleccionada
            )
          }
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default EditarProductoVentas;
