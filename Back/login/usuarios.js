import express from "express";
import { db } from "../db.js";
import validarAtributosUsuario from "../middlewares/validarAtributosUsuario.js";
import validarId from "../middlewares/validarId.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import passport from "passport";
import validarPermisosUsuario from "../middlewares/validarPermisosUsuario.js";

const router = express.Router();

router.get("/",
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador"]),
  async (req, res) => {
    try {
      const sql = "CALL spVerUsuarios";
      const [usuarios] = await db.execute(sql);

      return res.status(200).send({ usuarios });
    } catch (error) {
      return res.status(500).send({ error: "Error al traer usuarios" });
    }
});

router.get("/:id", 
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador"]),
  validarId(), 
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const id = Number(req.params.id);

    try {
      const sql = "CALL spVerUsuarioPorId(?)";
      const [usuario] = await db.execute(sql, [id]);

      if (usuario[0].length === 0) {
        return res.status(404).send({ error: "Usuario no encontrado" });
      }

      return res.status(200).send({ usuario: usuario[0][0] });
    } catch (error) {
      console.error("Error al traer el usuario: ", error.message);
    }
});
   

router.post("/",
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador"]),
  validarAtributosUsuario(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const username = req.body.username;
    const password = req.body.password;
    const idRol = req.body.idRol;

    const passwordHashed = await bcrypt.hash(password, 10);
    try {
      const sql = "CALL spNuevoUsuario(?,?,?)";
      await db.execute(sql, [username, passwordHashed, idRol]);

      return res.status(200).send({ usuario: { username, idRol } });
    } catch (error) {
      return res.status(500).send({ error: "Error al crear usuario" });
    }
});

router.put("/:id",
  passport.authenticate("jwt", { session: false }),
  validarPermisosUsuario(["Administrador"]),
  validarAtributosUsuario(),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errores: validacion.array() });
    }

    const idUsuario = Number(req.params.id);
    const username = req.body.username;
    const password = req.body.password;
    const idRol = req.body.idRol;

    const passwordHashed = await bcrypt.hash(password, 10);
    try {
      const sql = "CALL spModificarUsuario(?,?,?,?)";
      await db.execute(sql, [username, passwordHashed, idRol, idUsuario]);


      return res.status(200).send({ usuario: { username, idRol } });
    } catch (error) {
      return res.status(500).send({ error: "Error al modificar el usuario" });
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

    const sql = "CALL spEliminarUsuario(?)";

    try {
      await db.query(sql, [id]);
      return res.status(200).send({ id });
    } catch (error) {
      console.error("Error al eliminar el usuario: ", error.message);
      return res.status(500).send({ error: "Error al eliminar el usuario" });
    }
  }
);

export default router;
