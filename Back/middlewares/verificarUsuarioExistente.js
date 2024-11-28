import { db } from "../db.js";

const verificarUsuarioExistente = async (req, res, next) => {
    const username = req.body.username;
    const idUsuario = Number(req.params.id);
  
    try {
      const [usuarios] = await db.execute("CALL spVerUsuarios");
  
      const existeUsuario = usuarios[0].some((usuario) => {
        if (req.method === "PUT" && usuario.id_usuario === idUsuario) {
          return false;
        }
        return usuario.username == username;
      });
  
      if (existeUsuario) {
        return res.status(400).send({ errores: { username: { msg: "El nombre de usuario ya está en uso. Por favor, elija otro." } } });
      }
  
      next();
    } catch (error) {
      return res.status(500).send({ error: "Error al verificar el nombre de usuario" });
    }
  };
  

export default verificarUsuarioExistente;