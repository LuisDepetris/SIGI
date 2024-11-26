import express from "express";
import { db } from "../db.js";
import validarId from "../middlewares/validarId.js";
import validarAtributosVenta from "../middlewares/validarAtributosVenta.js";
import validarAtributosVentaProducto from "../middlewares/validarAtributosVentaProducto.js";
import { validationResult } from "express-validator";
import passport from "passport";
import validarPermisosUsuario from "../middlewares/validarPermisosUsuario.js";
const router = express.Router();

router.get("/", 
  async (req, res) => {
    try {
      const sql = "CALL spVerVentas()";
      const [ventas] = await db.execute(sql);
      return res.status(200).send({ ventas: ventas[0] });
    } catch (error) {
      return res.status(500).send({ error: "Error al traer ventas" });
    }
});

router.get("/:id/ventas_producto", 
  validarId(), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const id = Number(req.params.id);

    try {
      const sql = "CALL spVerVentaYProductosPorId (?)";
      const [ventaProductos] = await db.execute(sql, [id]);

      if (ventaProductos[0].length === 0) {
        return res
          .status(404)
          .send({ error: "Venta de productos no encontrada" });
      }

      const ventaYProductos = {
        idVenta: ventaProductos[0][0].id_venta,
        fecha: ventaProductos[0][0].fecha,
        ventaTotal: ventaProductos[0][0].venta_total,
        formaPago: ventaProductos[0][0].forma_pago,
        idFormaPago: ventaProductos[0][0].id_forma_pago,
        cantidadTotal: ventaProductos[0][0].cantidad_total,
        productos: [],
      };

      ventaProductos[0].forEach((producto) => {
        ventaYProductos.productos.push({
          idVentaProducto: producto.id_venta_producto,
          idProducto: producto.id_producto,
          nombreProducto: producto.nombre_producto,
          stockActual: producto.stock_actual,
          precioLista: producto.precio_lista,
          precioFinal: producto.precio_final,
          precioLista: producto.precio_lista,
          cantidad: producto.cantidad,
          subTotal: producto.venta_subtotal,
        });
      });

      return res.status(200).send({ ventaYProductos });
    } catch (error) {
      console.error("Error al traer la venta y  los productos: ", error.message);
      return res
        .status(500)
        .send({ error: "Error al traer la venta y  los productos" });
    }
});

router.post("/", 
  validarAtributosVenta(), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const ventaTotal = req.body.ventaTotal;
    const cantidadTotal = req.body.cantidadTotal;
    const idFormaPago = req.body.idFormaPago;
    const productos = req.body.productos;

    try {
      const sqlInsertarVenta = "CALL spCrearVenta (?,?,?)";
      const resultadoVentaInsertada = await db.execute(sqlInsertarVenta, [
        ventaTotal,
        cantidadTotal,
        idFormaPago,
      ]);
      const idVenta = resultadoVentaInsertada[0][0][0].id_venta;

      const sqlAgregarProductoAVenta =
        "CALL spAgregarProductoAVenta (?, ?, ?, ?)";

      for (const producto of productos) {
        const idProducto = producto.id_producto;
        const cantidad = producto.cantidad;
        const ventaSubTotal = producto.ventaSubTotal;

        await db.execute(sqlAgregarProductoAVenta, [
          idVenta,
          idProducto,
          cantidad,
          ventaSubTotal,
        ]);
      }

      return res
        .status(201)
        .send({ venta: { idVenta, ventaTotal, cantidadTotal, idFormaPago } });
    } catch (error) {
      console.error("Error al insertar la venta: ", error.message);
      return res.status(500).send({ error: "Error al insertar la venta" });
    }
});

router.put("/:id", 
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador, Editor"]),
  validarId(), 
  validarAtributosVenta(), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const idVenta = Number(req.params.id);
    const ventaTotal = req.body.ventaTotal;
    const cantidadTotal = req.body.cantidadTotal;
    const idFormaPago = req.body.idFormaPago;

    const sqlModificarVenta = "CALL spModificarVenta(?, ?, ?, ?)";

    try {
      await db.execute(sqlModificarVenta, [
        idVenta,
        ventaTotal,
        cantidadTotal,
        idFormaPago,
      ]);

      return res.status(201).send({
        ventaModificada: { idVenta, ventaTotal, cantidadTotal, idFormaPago },
      });
    } catch (error) {
      console.error("Error al editar la venta: ", error.message);
      return res.status(500).send({ error: "Error al editar la venta." });
    }
});

router.delete("/:id", 
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador"]),
  validarId(), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const id = Number(req.params.id);

    const sqlObtenerProductosDeVenta = "CALL spObtenerProductosDeVenta(?)";
    const sqlEliminarVenta = "CALL spEliminarVenta(?)";
    const sqlModificarStockActual = "CALL spModificarStockActual(?, ?)";

    try {

      const [productos] = await db.execute(sqlObtenerProductosDeVenta, [id]);
      for(const producto of productos[0]){
        const idProducto = producto.id_producto;
        const cantidad = producto.cantidad;
        await db.execute(sqlModificarStockActual, [idProducto, -cantidad]);
      }

      await db.execute(sqlEliminarVenta, [id]);
      return res.status(200).send({ id });
    } catch (error) {
      console.error("Error al eliminar la venta: ", error.message);
      return res.status(500).send({ error: "Error al eliminar la venta." });
    }
});

router.post("/:id/ventas_producto", 
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador, Editor"]),
  validarId(), 
  validarAtributosVentaProducto(), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const idVenta = Number(req.params.id);
    const idProducto = req.body.idProducto;
    const cantidad = req.body.cantidad;
    const ventaSubTotal = req.body.ventaSubTotal;

    try {
      const sqlAgregarProductoAVenta = "CALL spAgregarProductoAVenta(?, ?, ?, ?)";
      const resultadoProductoInsertadoAVenta = await db.execute(
        sqlAgregarProductoAVenta,
        [idVenta, idProducto, cantidad, ventaSubTotal]
      );
      const id_ventas_producto =
        resultadoProductoInsertadoAVenta[0][0][0].id_venta_producto;

      return res.status(201).send({
        productoAgregado: {
          id_ventas_producto,
          idVenta,
          idProducto,
          cantidad,
          ventaSubTotal,
        },
      });
    } catch (error) {
      console.error("Error al agregar producto:", error.message);
      return res.status(500).send({ error: "Error al agregar producto." });
    }
});

router.delete("/:id/ventas_producto/", 
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador, Editor"]),
  validarAtributosVentaProducto(), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const idVentaProducto = req.body.idVentaProducto;
    const idProducto = req.body.idProducto;
    const cantidad = req.body.cantidad;

    try {
      const sqlEliminarProductoDeUnaVenta =
        "CALL spEliminarProductoDeUnaVenta(?, ?, ?)";
      await db.execute(sqlEliminarProductoDeUnaVenta, [
        idVentaProducto,
        idProducto,
        cantidad,
      ]);

      return res.status(201).send({ id: { idVentaProducto } });
    } catch (error) {
      console.error("Error al eliminar el producto de la venta:", error.message);
      return res.status(500).send({ error: "Error al eliminar el producto de la venta." });
    }
});

export default router;
