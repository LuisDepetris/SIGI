import { useState, useEffect } from "react";
import "../styles/DetalleProducto.css";
import { useNavigate, useParams } from "react-router-dom";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const getProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/productos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProducto(data.producto);
        } else {
          console.error("Error al obtener el producto:", response.status);
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
      }
    };

    const getCategorias = async () => {
      try {
        const respuesta = await fetch("http://localhost:3000/categorias");
        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.error}`);
        }

        const data = await respuesta.json();
        setCategorias(data.categorias || []);
      } catch (error) {
        console.error("Error al obtener las categorias:", error);
        alert("No se pudo obtener las categorias");
      }
    };

    getProducto();
    getCategorias();
  }, [id]);

  const handleEdit = () => {
    navigate(`/productos/${id}/editar`);
  };

  const categoriaFiltrada = categorias.find(
    (categoria) => categoria.id_categoria === producto?.id_categoria
  );

  return (
    <div className='pageContainer'>
      <h2 className='pageTitle'>Consultar Producto</h2>
      {producto ? (
        <>
          <div className='viewGroup'>
            <label>ID Producto:</label>
            <div>{producto.id_producto}</div>
          </div>
          <div className='viewGroup'>
            <label>Nombre del Producto:</label>
            <div>{producto.nombre_producto}</div>
          </div>
          <div className='viewGroup'>
            <label>Stock Actual:</label>
            <div>{producto.stock_actual}</div>
          </div>
          <div className='viewGroup'>
            <label>Precio de Lista:</label>
            <div>${producto.precio_lista}</div>
          </div>
          <div className='viewGroup'>
            <label>Descuento 1:</label>
            <div>{producto.descuento_uno}%</div>
          </div>
          <div className='viewGroup'>
            <label>Descuento 2:</label>
            <div>{producto.descuento_dos}%</div>
          </div>
          <div className='viewGroup'>
            <label>Incremento:</label>
            <div>{producto.incremento}%</div>
          </div>
          <div className='viewGroup'>
            <label>Precio Final:</label>
            <div>${producto.precio_final}</div>
          </div>
          <div className='viewGroup'>
            <label>Categoría:</label>
            <div>
              {categoriaFiltrada
                ? categoriaFiltrada.descripcion
                : "Sin definir"}
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className='button cancelButton'
          >
            Cancelar
          </button>
          <button
            className='button saveButton'
            onClick={handleEdit}
          >
            Editar
          </button>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default DetalleProducto;
