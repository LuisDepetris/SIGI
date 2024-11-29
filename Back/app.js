import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import routerProductos from "./inventario/productos.js";
import routerVentas from "./gestionVentas/ventas.js";
import routerCategorias from "./inventario/categorias.js";
import routerUsuarios from "./login/usuarios.js";
import routerRoles from "./login/roles.js";
import routerAuth, { authConfig } from "./login/auth.js";
import routerFormasPago from "./gestionVentas/formasPago.js";

connectDB();
console.log("Base de Datos conectada");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());

// Configuro passport
authConfig();

// Conecta la ruta "productos" con el router
app.use("/productos", routerProductos);
app.use("/ventas", routerVentas);
app.use("/usuarios", routerUsuarios);
app.use("/categorias", routerCategorias);
app.use("/roles", routerRoles);
app.use("/auth", routerAuth);
app.use("/pagos", routerFormasPago);

app.listen(PORT, (err) => {
  console.log(
    err
      ? "Se produjo un error al iniciar el servidor"
      : `Servidor levantado en http://localhost:${PORT}`
  );
});
