import React from "react";
import { useState, useEffect } from "react";
import "../styles/GestionUsuarios.css";
import { useAuth } from "../auth/authContext";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usuario, setUsuario] = useState({
      id_usuario: 0,
      username: "",
      password: "",
      id_rol: 0
  })
  const { sesion } = useAuth();
  const [errores, setErrores] = useState({});

  const getUsuarios = async () => {
    const response = await fetch("http://localhost:3000/usuarios", {
        headers: {
            Authorization: `Bearer ${sesion.token}`
          }
    });
    if (response.ok) {
      const { usuarios } = await response.json();
      const usuariosFiltrados = usuarios.filter(
        (usuario) => usuario.inhabilitado == 0
      );
      setUsuarios(usuariosFiltrados);
    }
  };

  useEffect(() => {
    const getRoles = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/roles", {
          headers: {
            Authorization: `Bearer ${sesion.token}`
          }
        });

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
        }
        const {roles} = await respuesta.json();
        setRoles(roles);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };
    getUsuarios();
    getRoles();
  }, []);

  const handleEditar = (idUsuario) =>{
    const usuarioAEditar = usuarios.find(usu => usu.id_usuario === idUsuario);
    setUsuario({...usuarioAEditar, password: ""})
  }

  const handleEliminar = async (idUsuario) =>{
    const usuario = usuarios.find((usu) => usu.id_usuario == idUsuario);
    if(confirm(`¿Desea eliminar el usuario ${usuario.username}?`)){
      const response = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sesion.token}`,
        }
      })
      if(response.ok){
        getUsuarios();
      }
    }
  }

  const handleGuardar = async (e) =>{
    e.preventDefault();
    const method = usuario.id_usuario === 0 ? "POST" : "PUT";
    const url =
    usuario.id_usuario === 0
        ? `http://localhost:3000/usuarios`
        : `http://localhost:3000/usuarios/${usuario.id_usuario}`;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sesion.token}`,
      },
      body: JSON.stringify({ username: usuario.username, password: usuario.password, idRol: usuario.id_rol }),
    });
    if (response.ok) {
      setUsuario({
        id_usuario : 0,
        username: "",
        password: "",
        id_rol: 0
      })
      setErrores({})
      getUsuarios();
      alert(method == "POST" ? "¡Usuario creado con exito!" : "¡Usuario editado con exito!");
    } else {
      const { errores } = await response.json();
      setErrores(errores);
    }
  }

  const elegirRol = (e) => {
    const idActual = parseInt(e.target.value);
      setUsuario({ ...usuario, id_rol: idActual })
  };

  const handleCancelar = () =>{
    setUsuario({
      id_usuario: 0,
      username: "",
      password: "",
      id_rol: 0
    })
    setErrores({})
  }
  return (
    <div style={{ margin: "100px" }}>
      <h2>Gestion de Usuarios</h2>
      <form className="formulario-usuario">
        <div className="form-group">
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            value={usuario.username}
            onChange={(e) =>
              setUsuario({ ...usuario, username: e.target.value })
            }
          />
          {errores.username && <div style={{color: "red"}}>{errores.username.msg}</div>}
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={usuario.password}
            onChange={(e) =>
              setUsuario({ ...usuario, password: e.target.value })
            }
          />
          {errores.password && <div style={{color: "red"}}>{errores.password.msg}</div>}
        </div>
        <div className="form-group">
          <label>Rol:</label>
          <select name="idRol" value={usuario.id_rol} onChange={elegirRol}>
            <option value="0">Selecciona un rol</option>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.nombre}
              </option>
            ))}
          </select>
          {errores.idRol && <div style={{color: "red"}}>{errores.idRol.msg}</div>}
        </div>
        <div className="button-group">
          <button type="button" className="boton cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
          <button type="submit" className="boton agregar" onClick={handleGuardar}>
            Guardar
          </button>
        </div>
      </form>
      <table className="productos-tabla">
        <thead>
          <tr>
            <th></th>
            <th>ID Usuario</th>
            <th>
              Nombre de Usuario
            </th>
            <th>
              Rol
            </th>
          </tr>
          <tr>

          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>
                <button
                  className="btn-detalles" onClick={()=>handleEditar(usuario.id_usuario)}
                >
                  ✏️
                </button>
                {usuario.id_usuario != sesion.idUsuario && 
                ( <button className="btn-eliminar" onClick={() => handleEliminar(usuario.id_usuario)}> 🗑️ </button> )}
                {/* <button
                  className="btn-eliminar"
                  onClick={()=>handleEliminar(usuario.id_usuario)}
                >
                  🗑️
                </button> */}
              </td>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.username}</td>
              <td>
                {
                  roles.find(
                    (rol) =>
                      rol.id_rol === usuario.id_rol
                  )?.nombre
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;
