import express from "express";
import { db } from "../db.js";
import validarId from "../middlewares/validarId.js";
import { validationResult } from "express-validator";
import validarAtributosFormasPago from "../middlewares/validarAtributosFormasPago.js";


const router = express.Router();

router.get("/", async (req, res) =>{
    try {
        const sql = "CALL spVerFormasPago";
        const [formasPago] = await db.execute(sql);

        return res.status(200).send({ formasPago: formasPago[0] });
      } catch (error) {
        return res.status(500).send({ error: "Error al traer categorias" });
      }
})

router.post("/", validarAtributosFormasPago(), async (req, res) => {
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    res.status(400).send({ errores: validacion.mapped() });
    return;
  }
  
  const {descripcion} = req.body;
  const sql = "CALL spNuevaFormaPago(?)";
  try {
    await db.execute(sql, [descripcion]);
    return res.status(201).send({formaPago: descripcion});
  } catch (error) {
    console.error("Error al crear la forma de pago: ", error.message);
    return res.status(500).send({ error: "Error al crear la forma de pago" });
  }
})

router.put("/:id", validarId(), validarAtributosFormasPago(), async (req, res) =>{
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    res.status(400).send({ errores: validacion.mapped() });
    return;
  }

  const id = Number(req.params.id);
  const {descripcion} = req.body;
  const sql = "CALL spModificarFormaPago(?,?)";

  try {
      db.execute(sql, [id, descripcion]);
      return res.status(200).send({
          formaPago: {
              id_forma_pago: id,
              descripcion: descripcion
          }
      })
  } catch (error) {
      console.error("Error al editar la forma de pago: ", error.message);
      return res.status(500).send({ error: "Error al editar la forma de pago" });
  }

})

router.delete("/:id", validarId(), async (req, res) =>{

  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
  }

  const id = Number(req.params.id);
  const sql = "CALL spEliminarFormaPago(?)";

  try {
      await db.execute(sql, [id]);
      return res.status(200).send({ id });
  } catch (error) {
      console.error("Error al eliminar la forma de pago: ", error.message);
      return res.status(500).send({ error: "Error al eliminar la forma de pago" });
  }


})




export default router;
