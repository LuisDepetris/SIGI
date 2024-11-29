import { param } from "express-validator";

const validarId = () => param("id").isInt({ min: 1 }).withMessage("El id debe ser un numero entero positivo.");

export default validarId;