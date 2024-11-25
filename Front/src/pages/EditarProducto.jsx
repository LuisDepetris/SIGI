import React, { useState, useEffect } from "react";
import Formulario from "../components/Formulario";
import styles from "../styles/DetalleProducto.module.css";
import { useNavigate, useParams } from "react-router-dom";

const EditarProducto = () => {
  const [producto, setProducto] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/productos/${id}`);
        if (response.ok) {
          const { producto } = await response.json();
          setProducto(producto);
        } else {
          console.error("Error al obtener el producto:", response.status);
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
      }
    };
    getProducto();
  }, [id]);

  const handleGuardar = (productoActualizado) => {
    if(window.confirm("Esta seguro que desea editar este producto?")){
      alert("Producto actualizado")
      console.log("Producto actualizado:", productoActualizado);
      navigate(`/Productos`);
    }else{
      alert("Se cancelo la operacion!");
    }
  };

  const handleCancelar = () => {
    navigate(-1);
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Editar Producto</h2>
      {producto && (
        <Formulario
          producto={producto}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}
    </div>
  );
};

export default EditarProducto;
