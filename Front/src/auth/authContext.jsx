import { createContext, useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "../styles/Login.css";


const AuthContext = createContext();

// Hook con sesion
export const useAuth = () => {
  return useContext(AuthContext);
};

// Componente principal
export const AuthProvider = ({ children }) => {
  const [sesion, setSesion] = useState(
    JSON.parse(localStorage.getItem("sesion")) || null
  );

  const login = async (username, password, ok, error) => {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      error();
      return;
    }
    const sesion = await response.json();
    setSesion(sesion);
    localStorage.setItem("sesion", JSON.stringify(sesion));
    ok();
  };

  const logout = (ok) => {
    setSesion(null);
    localStorage.removeItem("sesion");
    ok();
  };

  const value = { sesion, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Autorizar pagina
export const AuthPage = ({ children }) => {
  const { sesion } = useAuth();
  const location = useLocation();

  if (!sesion) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Autorizar rol
export const AuthRol = ({ roles, children }) => {
  const { sesion } = useAuth();

  if (!sesion || !roles.includes(sesion.rol)) {
    return <Navigate to="/prohibido" replace />;
  }

  return children;
};

// Estado de autorizacion
export const AuthStatus = () => {
  const { sesion, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!sesion) {
    return (
      <div>
        <span>No está conectado</span>
        <button
          onClick={() =>
            navigate("/", {
              state: { from: location },
              replace: true,
            })
          }
          className="button-login"
        >
          Ingresar
        </button>
      </div>
    );
  }

  return (
    <div style={{ flexDirection: "row" }} className="user-info" >
      <span >{sesion.username}</span>
      <button onClick={() => logout(() => navigate("/", { replace: true }))} className="btn-auth">
        Salir
      </button>
    </div>
  );
};
