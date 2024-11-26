import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/authContext";
import "../styles/Login.css";

const Login = () => {
  const { sesion, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);

  if (sesion) {
    return <Navigate to="/productos" replace />;
  }

  const from = location.state?.from?.pathname || "/";

  const onSubmit = (event) => {
    const formData = new FormData(event.currentTarget);
    const usuario = formData.get("usuario");
    const password = formData.get("password");

    login(
      usuario,
      password,
      () => navigate(from, { replace: true }), // OK
      () => setError(true) // Error
    );

    event.preventDefault();
  };

  return (
    <div className="container container-login">
      <form className="form-login" onSubmit={onSubmit}>
        <label htmlFor="usuario" className="label-login">Usuario:</label>
        <input name="usuario" type="text" className="input-login"/>
        <label htmlFor="password" className="label-login">Contraseña:</label>
        <input name="password" type="password" className="input-login"/>
        <button type="submit" className="button-login">Ingresar</button>
      {error && <p>Usuario o contraseña inválido</p>}
      </form>
    </div>
  );
};

export default Login;
