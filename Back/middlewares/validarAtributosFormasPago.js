import { body } from "express-validator";

const validarAtributosFormasPago = () => [
    body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("No se puede cargar una forma de pago vacia")
    .bail()
    .matches(/^[a-zA-Z\s]+$/)
    .bail()
    .withMessage("La forma de pago solo debe contener letras")
    .isLength({ min: 2 })
    .withMessage("La forma de pago debe tener al menos 2 caracteres")
];

export default validarAtributosFormasPago;
