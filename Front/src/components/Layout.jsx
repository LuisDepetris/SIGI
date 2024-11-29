import React from "react";
import Menu from "./Menu";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Menu />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
