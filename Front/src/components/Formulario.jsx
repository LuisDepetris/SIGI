import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "../styles/Formulario.module.css";

const Formulario = ({ producto, onGuardar, onCancelar }) => {
  const [data, setData] = useState({
    id_producto: producto?.id_producto || 0,
    nombre_producto: producto?.nombre_producto || '',
    stock_actual: producto?.stock_actual || 0,
    precio_lista: producto?.precio_lista || 0,
    descuento_uno: producto?.descuento_uno || 0,
    descuento_dos: producto?.descuento_dos || 0,
    incremento: producto?.incremento || 0,
    precio_final: producto?.precio_final || 0,
    id_categoria: producto?.id_categoria || 0,
    modificadoPor: 13
  });
  const [categorias, setCategorias] = useState([]);
  const [error,setError] = useState({})
  const navigate = useNavigate(); 

  useEffect(() => {
    const getCategorias = async () => {
      const response = await fetch("http://localhost:3000/categorias");
      if (response.ok) {
        const result = await response.json();
        const categorias = result.categorias[0];
        setCategorias(categorias);
      }
    };
    getCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const elegirCategoria = (e) => {
    const idActual = parseInt(e.target.value);
    if (idActual === -1) {
      navigate("/productos/categorias"); 
    } else {
      setData({ ...data, id_categoria: idActual });
    }
  };

  const handleCargar = async (e) => {
    e.preventDefault();
    const method = data.id_producto === 0 ? "POST" : "PUT";
    const url = data.id_producto === 0 ? `http://localhost:3000/productos` : `http://localhost:3000/productos/${data.id_producto}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreProducto: data.nombre_producto,
          stockActual: data.stock_actual,
          precioLista: data.precio_lista,
          descuentoUno: data.descuento_uno,
          descuentoDos: data.descuento_dos,
          incremento: data.incremento,
          precioFinal: data.precio_final,
          idCategoria: data.id_categoria,
          modificadoPor: 13,
        }),
      });
      
      if (response.ok) {
        const { producto } = await response.json();
        onGuardar(producto);
      } else {
        const {errores} = await response.json()
        setError(errores)
        console.error("Error al guardar el producto:", response.status);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleCargar}>
      {data.id_producto > 0 && (
        <div className={styles.formGroup}>
          <label>ID Producto</label>
          <p>{data.id_producto}</p>
        </div>
      )}

      <div className={styles.formGroup}>
        <label>Nombre del Producto</label>
        <input
          type="text"
          name="nombre_producto"
          value={data.nombre_producto}
          onChange={handleChange}
        />
        {error.nombreProducto && <div style={{color: "red"}}>{error.nombreProducto.msg}</div>}
      </div>
      <div className={styles.formGroup}>
        <label>Stock</label>
        <input
          type="number"
          name="stock_actual"
          value={data.stock_actual}
          onChange={handleChange}
        />
        {error.stockActual && <div style={{color: "red"}}>{error.stockActual.msg}</div>}
      </div>
      <div className={styles.formGroup}>
        <label>Precio Lista</label>
        <input
          type="number"
          name="precio_lista"
          value={data.precio_lista}
          onChange={handleChange}
        />
        {error.precioLista && <div style={{color: "red"}}>{error.precioLista.msg}</div>}
      </div>
      <div className={styles.formGroup}>
        <label>Descuento uno</label>
        <input
          type="number"
          name="descuento_uno"
          value={data.descuento_uno}
          onChange={handleChange}
        />
        {error.descuentoUno && <div style={{color: "red"}}>{error.descuentoUno.msg}</div>}
      </div>
      <div className={styles.formGroup}>
        <label>Descuento dos</label>
        <input
          type="number"
          name="descuento_dos"
          value={data.descuento_dos}
          onChange={handleChange}
        />
        {error.descuentoDos && <div style={{color: "red"}}>{error.descuentoDos.msg}</div>}
      </div>
      <div className={styles.formGroup}>
        <label>Incremento</label>
        <input
          type="number"
          name="incremento"
          value={data.incremento}
          onChange={handleChange}
        />
        {error.incremento && <div style={{color: "red"}}>{error.incremento.msg}</div>}
      </div>
      <div className={styles.formGroup}>
        <label>Precio Final</label>
        <input
          type="number"
          name="precio_final"
          value={data.precio_final}
          onChange={handleChange}
        />
        {error.precioFinal && <div style={{color: "red"}}>{error.precioFinal.msg}</div>}
      </div>
      <div className={styles.formGroup}>
        <label>Categoría</label>
        <select name="idCategoria" value={data.id_categoria} onChange={elegirCategoria}>
          <option value="0">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.descripcion}
            </option>
          ))}
          <option value={-1}>Agregar nueva categoría</option>
        </select>
        {error.idCategoria && <div style={{color: "red"}}>{error.idCategoria.msg}</div>}
      </div>
      <div className={styles.buttonGroup}>
        <button type="button" onClick={onCancelar} className={`${styles.button} ${styles.cancelButton}`}>
          Cancelar
        </button>
        <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
          {data.id_producto === 0 ? "Guardar y Cerrar" : "Editar y Cerrar"}
        </button>
      </div>
    </form>
  );
};

export default Formulario;

