import { body } from "express-validator";

const validarAtributosVentaProducto = () => [
    body("idProducto").isInt({ min: 1 }).withMessage("El id debe ser un numero entero positivo."),
    body("cantidad").notEmpty().withMessage("La cantidad total no puede estar vacío").bail().isInt().withMessage("La cantidad total debe ser un número entero").bail().custom((value) => value >= 0).withMessage("La cantidad total no puede ser negativo"),
    body("ventaSubTotal").trim().notEmpty().withMessage("La venta total no puede estar vacía").bail().isFloat({ min: 0 }).withMessage("La venta total no puede ser negativo"),
    body("idVentaProducto").optional().isInt({ min: 1 }).withMessage("El id debe ser un numero entero positivo."),
];

export default validarAtributosVentaProducto;
