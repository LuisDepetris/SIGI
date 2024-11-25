import { body } from "express-validator";

const validarAtributosUsuario = () => [
  body("username")
    .notEmpty()
    .withMessage("El username no puede estar vacío")
    .bail()
    .isLength({ max: 50 })
    .withMessage("El username no puede tener más de 50 caracteres"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "La contraseña debe contener al menos 8 caracteres, incluyendo 1 letra minúscula, 1 letra mayúscula y 1 número"
    )
    .bail()
    .isLength({ max: 60 }),
  body("idRol")
    .notEmpty()
    .withMessage("El id del rol no puede estar vacío")
    .bail()
    .isInt()
    .withMessage("El id del rol debe ser un número entero")
    .bail()
    .custom((value) => value >= 0)
    .withMessage("El id del rol no puede ser negativo")
    .bail(),
];

export default validarAtributosUsuario;
