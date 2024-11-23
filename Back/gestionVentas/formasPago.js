import express from "express";
import { db } from "../db.js";

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




export default router;
