import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/AgregarProductoVentas.css";
import { useAuth } from "../auth/authContext";
import SelectorFormasPago from "../components/SelectorFormasPago";
import SelectorProductos from "../components/SelectorProductos";

function AgregarProductoVentas() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [productosVendidos, setProductosVendidos] = useState([]);
  const { sesion } = useAuth();
  const [productosActualizados, setProductosActualizados] = useState([]);
  const navigate = useNavigate();
  const [formasPago, setFormasPago] = useState([]);
  const [formaPagoSeleccionada, setFormaPagoSeleccionada] = useState("");
  const { idVenta } = useParams();

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

  const handleVolver = () => {
    navigate("/ventas");
  };

  const handleGuardar = async () => {
    if (productosVendidos.length === 0) {
      setError("Debe agregar un producto");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/ventas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sesion.token}`,
        },
        body: JSON.stringify({
          ventaTotal: ventaTotal,
          cantidadTotal: cantidad,
          idFormaPago: formaPagoSeleccionada,
          productos: productosVendidos,
        }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
      }

      setError("");
      navigate("/ventas", { replace: true });
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setError("No se pudo agregar el producto a la venta.");
    }
  };

  const subtotal = productoSeleccionado
    ? productoSeleccionado.precio_final * cantidad
    : 0;

  const ventaTotal = productosVendidos.reduce(
    (ac, current) => ac + current.ventaSubTotal,
    0
  );

  const handleAgregarProducto = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      setError("Seleccione un producto y una cantidad válida.");
      return;
    }

    if (cantidad > productoSeleccionado.stock_actual) {
      setError("La cantidad excede el stock disponible.");
      return;
    }

    const estaCargado = productosVendidos.some(
      (producto) => producto.id_producto === productoSeleccionado.id_producto
    );
    if (estaCargado) {
      const productosActualizados = productosVendidos.map((producto) => {
        if (producto.id_producto === productoSeleccionado.id_producto) {
          return {
            ...producto,
            cantidad: cantidad,
            ventaSubTotal: subtotal,
          };
        }
        return producto;
      });
      setProductosVendidos(productosActualizados);
    } else {
      setProductosVendidos([
        ...productosVendidos,
        {
          ...productoSeleccionado,
          ventaSubTotal: subtotal,
          cantidad: cantidad,
        },
      ]);
    }
  };

  const handleBorrar = (id_producto) => {
    const productosActualizados = productosVendidos.filter(
      (producto) => producto.id_producto !== id_producto
    );
    setProductosVendidos(productosActualizados);
  };

  const elegirMedioPago = (e) => {
    const idActual = parseInt(e.target.value);
    if (idActual === -1) {
      navigate("GestionFormPagos");
    } else {
      setFormaPagoSeleccionada(idActual);
    }
  };

  const cantidadTotal = productosVendidos.reduce(
    (acumulador, producto) => acumulador + producto.cantidad,
    0
  );

  return (
    <div className="pagina-completa">
      <div className="detalle-ventas">
        <h2>Detalle de Venta #{idVenta}</h2>
        <p>
          <strong>Total de Venta:</strong> ${ventaTotal}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
        <div>
          <strong>Forma de Pago:</strong>
          <SelectorFormasPago
            value={formaPagoSeleccionada}
            onChange={(e) => {
              const idActual = parseInt(e.target.value);
              if (idActual === -1) {
                navigate("GestionFormPagos");
              } else {
                setFormaPagoSeleccionada(idActual);
              }
            }}
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
              <tr key={producto.id_producto}>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleBorrar(producto.id_producto)}
                  >
                    🗑️
                  </button>
                </td>
                <td>{producto.id_producto}</td>
                <td>{producto.nombre_producto}</td>
                <td>${producto.precio_final}</td>
                <td>{producto.cantidad}</td>
                <td>${producto.ventaSubTotal}</td>
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
          onClick={handleGuardar}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default AgregarProductoVentas;
