import { body } from "express-validator";

const validarAtributosFormasPago = () => [
    body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("No se puede cargar una forma de pago vacia")
    .bail()
    .isAlphanumeric('es-ES',{ignore:' '})
    .withMessage("La forma de pago debe ser alfanumérica")
    .bail()
    .isLength({ min: 2 })
    .withMessage("La forma de pago debe tener al menos 2 caracteres")
    .bail()
    .isLength({ max: 50 })
    .withMessage("La forma de pago no puede tener más de 50 caracteres")
    .bail()
    .matches(/[a-zA-Z]/)
    .withMessage("La forma de pago debe contener al menos una letra"),
];

export default validarAtributosFormasPago;
