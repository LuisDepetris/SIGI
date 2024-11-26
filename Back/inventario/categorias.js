import express from "express";
import { db } from "../db.js";
import validarId from "../middlewares/validarId.js";
import { validationResult } from "express-validator";
import validarAtributosCategoria from "../middlewares/validarAtributosCategoria.js";
import passport from "passport";
import validarPermisosUsuario from "../middlewares/validarPermisosUsuario.js";

const router = express.Router();

router.get("/", async (req, res) =>{
    try {
        const sql = "CALL spVerCategorias";
        const [categorias] = await db.execute(sql);

        return res.status(200).send({ categorias: categorias[0] });
      } catch (error) {
        return res.status(500).send({ error: "Error al traer categorias" });
      }
})

router.put("/:id", 
    passport.authenticate("jwt", { session: false }),
    validarPermisosUsuario(["Administrador", "Editor"]),
    validarId(), 
    validarAtributosCategoria, 
    async (req, res) =>{
        const id = Number(req.params.id);
        const {descripcion} = req.body;
        const sql = "CALL spModificarCategoria(?,?)";

        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
        res.status(400).send({ errores: validacion.mapped() });
        return;
        }
        try {
            db.execute(sql, [id, descripcion]);
            return res.status(200).send({
                categoria: {
                    id_categoria: id,
                    descripcion: descripcion
                }
            })
        } catch (error) {
            console.error("Error al editar la categoria: ", error.message);
            return res.status(500).send({ error: "Error al editar la categoria" });
        }

})

router.post("/", 
    passport.authenticate("jwt", { session: false }),
    validarPermisosUsuario(["Administrador", "Editor"]),
    validarAtributosCategoria, 
    async (req, res) =>{
        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({ errores: validacion.mapped() });
            return;
        }
        
        const {descripcion} = req.body;
        const sql = "CALL spNuevaCategoria(?)";

        try {
            await db.execute(sql, [descripcion]);
            return res.status(201).send({ categoria: { descripcion } });
        } catch (error) {
            console.error("Error al insertar la categoria: ", error.message);
            return res.status(500).send({ error: "Error al insertar la categoria" });
        }

})

router.delete("/:id",
    passport.authenticate("jwt", { session: false }),
    validarPermisosUsuario(["Administrador", "Editor"]),
    validarId(), 
    async (req, res) =>{
        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({ errores: validacion.array() });
            return;
        }

        const id = Number(req.params.id);
        const sql = "CALL spEliminarCategoria(?)";

        try {
            await db.execute(sql, [id]);
            return res.status(200).send({ id });
        } catch (error) {
            console.error("Error al eliminar la categoria: ", error.message);
            return res.status(500).send({ error: "Error al eliminar la categoria" });
        }


})


export default router;
