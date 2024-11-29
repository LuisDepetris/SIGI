import express from "express";
import { db } from "../db.js";
import validarPaginacionProductos from "../middlewares/validarPaginacionProductos.js";
import validarId from "../middlewares/validarId.js";
import validarAtributosProducto from "../middlewares/validarAtributosProducto.js";
import { validationResult } from "express-validator";
import passport from "passport";
import validarPermisosUsuario from "../middlewares/validarPermisosUsuario.js";
const router = express.Router();

router.get("/", 
  validarPaginacionProductos(), 
  async (req, res) => {
    const {
      offset = 0,
      limit = 10,
      sort = "nombre_producto",
      order = "ASC",
      search = "",
    } = req.query;

    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    try {
      const sqlFetchProductos = "CALL spVerProductos(?, ?, ?, ?,?)";
      const [productos] = await db.execute(sqlFetchProductos, [
        offset,
        limit,
        sort,
        order,
        search,
      ]);

      const sqlTotalProductos =
        "SELECT COUNT(*) AS total FROM productos WHERE inhabilitado = FALSE AND nombre_producto LIKE ?;";
      const [total] = await db.execute(sqlTotalProductos, [`%${search}%`]);

      return res
        .status(200)
        .send({ productos: productos[0], paginacion: { total: total[0].total } });
    } catch (error) {
      return res.status(500).send({ error: "Error al traer productos" });
    }
});

router.get("/:id", 
  validarId(), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const id = Number(req.params.id);

    try {
      const sql = "CALL spVerProductoPorId(?)";
      const [producto] = await db.execute(sql, [id]);

      if (producto[0].length === 0) {
        return res.status(404).send({ error: "Producto no encontrado" });
      }

      return res.status(200).send({ producto: producto[0][0] });
    } catch (error) {
      console.error("Error al traer el producto: ", error.message);
      return res.status(500).send({ error: "Error al traer el producto" });
    }
});

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador", "Editor"]),
  validarId(),
  validarAtributosProducto("PUT"), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.mapped() });
      return;
    }

    const id = Number(req.params.id);
    const nombreProducto = req.body.nombreProducto;
    const stockActual = req.body.stockActual;
    const precioLista = req.body.precioLista;
    const descuentoUno = req.body.descuentoUno;
    const descuentoDos = req.body.descuentoDos;
    const incremento = req.body.incremento;
    const precioFinal = req.body.precioFinal;
    const idCategoria = req.body.idCategoria;
    const modificadoPor = req.body.modificadoPor;

    const sql = "CALL spModificarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try {
      await db.execute(sql, [
        nombreProducto,
        stockActual,
        precioLista,
        descuentoUno,
        descuentoDos,
        incremento,
        precioFinal,
        idCategoria,
        modificadoPor,
        id,
      ]);

      return res.status(200).send({
        producto: {
          id,
          nombreProducto,
          stockActual,
          precioLista,
          descuentoUno,
          descuentoDos,
          incremento,
          precioFinal,
          idCategoria,
          modificadoPor,
        },
      });
    } catch (error) {
      console.error("Error al editar el producto: ", error.message);
      return res.status(500).send({ error: "Error al editar el producto" });
    }
  }
);

router.post("/", 
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador", "Editor"]),
  validarAtributosProducto("POST"), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.mapped() });
      return;
    }

    const nombreProducto = req.body.nombreProducto;
    const stockActual = req.body.stockActual;
    const precioLista = req.body.precioLista;
    const descuentoUno = req.body.descuentoUno;
    const descuentoDos = req.body.descuentoDos;
    const incremento = req.body.incremento;
    const precioFinal = req.body.precioFinal;
    const idCategoria = req.body.idCategoria;

    try {
      await db.execute(`CALL spNuevoProducto (?, ?, ?, ?, ?, ?, ?, ?)`, [
        nombreProducto,
        stockActual,
        precioLista,
        descuentoUno,
        descuentoDos,
        incremento,
        precioFinal,
        idCategoria,
      ]);

      return res.status(201).send({ producto: { nombreProducto } });
    } catch (error) {
      console.error("Error al insertar el producto: ", error.message);
      return res.status(500).send({ error: "Error al insertar el producto" });
    }
});

router.delete(
  "/:id",
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

    const sql = "CALL spEliminarProducto(?)";

    try {
      await db.execute(sql, [id]);
      return res.status(200).send({ id });
    } catch (error) {
      console.error("Error al eliminar el producto: ", error.message);
      return res.status(500).send({ error: "Error al eliminar el producto" });
    }
  }
);

export default router;
