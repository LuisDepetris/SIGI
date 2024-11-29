import { query } from "express-validator";

const validarPaginacionProductos = () => [
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El offset debe ser un número entero mayor o igual a 0.")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El limit debe ser un número entero entre 1 y 100.")
    .toInt(),

  query("sort")
    .optional()
    .isString()
    .isIn([
      "nombre_producto",
      "precio_lista",
      "precio_final",
      "stock_actual",
      "categoria",
    ])
    .withMessage("El sort debe ser un campo válido para ordenar."),

  query("order")
    .optional()
    .isString()
    .isIn(["asc", "desc", "ASC", "DESC"])
    .withMessage("El order debe ser 'asc', 'desc', 'ASC' o 'DESC'."),

  query("search")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("El search debe ser una cadena de texto con un máximo de 100 caracteres."),
];

export default validarPaginacionProductos;
