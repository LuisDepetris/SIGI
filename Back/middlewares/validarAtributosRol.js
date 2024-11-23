import {body} from "express-validator";

const validarAtributosRol = () => [
    body("nombre").trim().notEmpty().withMessage("El nombre no puede estar vacío").bail().isAlphanumeric('es-ES',{ignore: ' '}).withMessage("El nombre debe ser alfanumérico").bail().isLength({ max: 50 }).withMessage("El nombre no puede tener más de 100 caracteres").bail().matches(/[a-zA-Z]/).withMessage("El nombre  debe contener al menos una letra")
];

export default validarAtributosRol;