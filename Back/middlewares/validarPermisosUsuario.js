const validarPermisosUsuario = (roles) => {
  return (req, res, next) => {
    const { rol } = req.user;

    if (!roles.includes(rol)) {
      return res
        .status(403)
        .send({ error: "No tiene permisos para realizar esta acción" });
    } else {
      return next();
    }
  };
};

export default validarPermisosUsuario;
