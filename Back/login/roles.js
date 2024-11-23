import express from "express";
import { db } from "../db.js";
import passport from "passport";
import validarPermisosUsuario from "../middlewares/validarPermisosUsuario.js";
import validarId from "../middlewares/validarId.js";
import validarAtributosRol from "../middlewares/validarAtributosRol.js";
import { validationResult } from "express-validator";

const router = express.Router();

router.get("/",
  async (req, res) => {
    try {
      const sql = "CALL spVerRoles()";
      const [roles] = await db.execute(sql);

      return res.status(200).send({ roles : roles[0] });
    } catch (error) {
      return res.status(500).send({ error: "Error al traer roles" });
    }
});

router.post("/", 
  // passport.authenticate("jwt", { session: false }),
  // validarPermisosUsuario(["Administrador"]),
  validarAtributosRol(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const nombre = req.body.nombre;
    try {
      const sql = "CALL spCrearRol(?)";
      await db.execute(sql, [nombre]);

      return res.status(200).send({ rol: { nombre } });
    } catch (error) {
      return res.status(500).send({ error: "Error al crear rol" });
    }
});

router.put("/:id",
  // passport.authenticate("jwt", { session: false }),
  // validarPermisosUsuario(["Administrador"]),
  validarId(),
  validarAtributosRol(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const idRol = Number(req.params.id);
    const nombre = req.body.nombre;

    try {
      const sql = "CALL spModificarRol(?,?)";
      await db.execute(sql, [nombre, idRol]);

      return res.status(200).send({ rol: { nombre, idRol } });
    } catch (error) {
      return res.status(500).send({ error: "Error al modificar el rol" });
    }
});

router.delete("/:id", 
  // passport.authenticate("jwt", { session: false }),
  // validarPermisosUsuario(["Administrador"]),
  validarId(), 
  validarAtributosRol(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const id = Number(req.params.id);

    const sql = "CALL spEliminarRol(?)";

    try {
      await db.query(sql, [id]);
      return res.status(200).send({ id });
    } catch (error) {
      console.error("Error al eliminar el rol: ", error.message);
      return res.status(500).send({ error: "Error al eliminar el rol" });
    }
});

export default router;
