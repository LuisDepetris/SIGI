import { body } from "express-validator";

const validarAtributosCategoria = () => [
    body("ventaTotal").trim().notEmpty().withMessage("La venta total no puede estar vacía").bail().isFloat({ min: 0 }).withMessage("La venta total no puede ser negativo"),
    body("cantidadTotal").notEmpty().withMessage("La cantidad total no puede estar vacío").bail().isInt().withMessage("La cantidad total debe ser un número entero").bail().custom((value) => value >= 0).withMessage("La cantidad total no puede ser negativo"),
    body("idFormaPago").isInt({ min: 1 }).withMessage("El id debe ser un numero entero positivo."),
    body("productos").optional().isArray({ min: 1 }).withMessage("Debe haber al menos un producto en la venta"),
    body("productos.*.id_producto").optional().notEmpty().withMessage("El ID del producto no puede estar vacío").bail().isInt().withMessage("El ID del producto debe ser un número entero"),
    body("productos.*.cantidad").optional().notEmpty().withMessage("La cantidad del producto no puede estar vacía").bail().isInt({ min: 1 }).withMessage("La cantidad del producto debe ser un número entero positivo"),
    body("productos.*.ventaSubTotal").optional().notEmpty().withMessage("El subtotal de la venta del producto no puede estar vacío").bail().isFloat({ min: 0 }).withMessage("El subtotal de la venta del producto debe ser un número positivo")
];

export default validarAtributosCategoria;
