import React from "react";
import { useNavigate } from "react-router-dom";

const NoPermitido = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1, { replace: true });
  };

  return (
    <>
      <div style={{ marginTop: "100px" }}>Sin permisos</div>
      <button onClick={handleClick}>VOLVER</button>
    </>
  );
};

export default NoPermitido;
