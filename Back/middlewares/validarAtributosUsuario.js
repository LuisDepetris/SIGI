import { body } from "express-validator";

const validarAtributosUsuario = () => [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario no puede estar vacío")
    .bail()
    .isLength({ max: 50 })
    .withMessage("El nombre de usuario no puede tener más de 50 caracteres"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña no puede estar vacia")
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
    .custom((value) => value > 0)
    .withMessage("Debe seleccionar una categoria")
];

export default validarAtributosUsuario;
