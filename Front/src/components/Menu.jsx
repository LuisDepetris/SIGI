import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Menu.css";
import { AuthStatus } from "../auth/authContext";

function Menu() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <header className="header">
      <button onClick={toggleMenu} className="menu-icon">
        &#9776;
      </button>
      <h1 style={{ flex: 1 }}>
        Sistema de Gestión de Inventario - Connor Pet Shop
      </h1>
      {menuAbierto && (
        <div className="menu-desplegable">
          <ul>
            <li>
              <Link to="/" onClick={() => setMenuAbierto(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/ventas" onClick={() => setMenuAbierto(false)}>
                Ventas
              </Link>
            </li>
            <li>
              <Link to="/productos" onClick={() => setMenuAbierto(false)}>
                Productos
              </Link>
            </li>
            <li>
              <Link to="/usuarios" onClick={() => setMenuAbierto(false)}>
                Gestión de Usuarios
              </Link>
            </li>
          </ul>
        </div>
      )}

      <AuthStatus />
    </header>
  );
}

export default Menu;
