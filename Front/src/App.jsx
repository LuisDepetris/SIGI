import React from "react";
import { Routes, Route } from "react-router-dom";
import Ventas from "./pages/Ventas";
import Productos from "./pages/Productos";
import AgregarProducto from "./pages/AgregarProducto";
import DetalleProducto from "./pages/DetalleProducto";
import EditarProducto from "./pages/EditarProducto";
import GestionCategorias from "./pages/GestionCategoria";
import Layout from "./components/Layout";
import VentanaPrincipal from "./pages/VentanaPrincipal";
import DetalleVentas from "./pages/DetalleVentas";
import AgregarProductoVentas from "./pages/AgregarProductoVentas";
import GestionFormPagos from "./pages/GestionFormPagos";
import { AuthPage, AuthRol } from "./auth/authContext";
import GestionUsuarios from "./pages/GestionUsuarios";
import Login from "./pages/Login";
import NoPermitido from "./pages/NoPermitido";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route index element={<VentanaPrincipal />} /> */}
        <Route index element={<Login />} />
        <Route
          path="ventas"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor", "Lector"]}>
                <Ventas />
              </AuthRol>
            </AuthPage>
          }
        />
        <Route
          path="productos"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor", "Lector"]}>
                <Productos />
              </AuthRol>
            </AuthPage>
          }
        />

        <Route
          path="productos/agregar"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor"]}>
                <AgregarProducto />
              </AuthRol>
            </AuthPage>
          }
        />

        <Route
          path="productos/:id"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor", "Lector"]}>
                <DetalleProducto />
              </AuthRol>
            </AuthPage>
          }
        />

        <Route
          path="productos/:id/editar"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor"]}>
                <EditarProducto />
              </AuthRol>
            </AuthPage>
          }
        />

        <Route
          path="productos/categorias"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor"]}>
                <GestionCategorias />
              </AuthRol>
            </AuthPage>
          }
        />

        <Route
          path="/ventas/:id"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor", "Lector"]}>
                <DetalleVentas />
              </AuthRol>
            </AuthPage>
          }
        />
        <Route
          path="/agregarProductoventas"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor", "Lector"]}>
                <AgregarProductoVentas />
              </AuthRol>
            </AuthPage>
          }
        />
        <Route
          path="/GestionFormPagos"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador", "Editor", "Lector"]}>
                <GestionFormPagos />
              </AuthRol>
            </AuthPage>
          }
        />
        <Route
          path="usuarios"
          element={
            <AuthPage>
              <AuthRol roles={["Administrador"]}>
                <GestionUsuarios />
              </AuthRol>
            </AuthPage>
          }
        />

        <Route
          path="/prohibido"
          element={
            <AuthRol roles={["Administrador", "Editor", "Lector"]}>
              <NoPermitido />
            </AuthRol>
          }
        />
        <Route
          path="*"
          element={
            <div style={{ margin: "100px" }}>
              <h1>404: Not Found</h1>
            </div>
          }
        />
        <Route
          path="ventas/:id/formas_de_pago"
          element={<GestionFormPagos />}
        />
      </Route>
    </Routes>
  );
}

export default App;
