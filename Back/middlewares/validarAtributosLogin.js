import { body } from "express-validator";

const validarAtributosUsuario = () => [
  body("username")
    .notEmpty()
    .withMessage("El username no puede estar vacío")
    .bail()
    .isLength({ max: 50 })
    .withMessage("El username no puede tener más de 50 caracteres"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacío")
    .bail()
    .isLength({ max: 60 })
    .withMessage("La contraseña no puede tener más de 60 caracteres"),
];

export default validarAtributosUsuario;
