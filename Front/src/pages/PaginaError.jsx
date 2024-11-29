import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PaginaError.css";

const PaginaError = ({ mensaje }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1, { replace: true });
  };

  return (
    <div className="container-error">
      <div style={{ fontSize: "15pt" }}>{mensaje}</div>
      <button className="btn-volver" onClick={handleClick}>
        VOLVER
      </button>
    </div>
  );
};

export default PaginaError;
