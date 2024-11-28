-- DROPEAR TABLAS Y SPs
DROP TABLE IF EXISTS ventas_producto;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS formas_pago;
DROP TABLE IF EXISTS categorias_producto;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

DROP PROCEDURE IF EXISTS spVerProductos;
DROP PROCEDURE IF EXISTS spVerProductoPorId;
DROP PROCEDURE IF EXISTS spModificarProducto;
DROP PROCEDURE IF EXISTS spNuevoProducto;
DROP PROCEDURE IF EXISTS spEliminarProducto;
DROP PROCEDURE IF EXISTS spVerUsuarios;
DROP PROCEDURE IF EXISTS spVerUsuarioPorId;
DROP PROCEDURE IF EXISTS spNuevoUsuario;
DROP PROCEDURE IF EXISTS spModificarUsuario;
DROP PROCEDURE IF EXISTS spEliminarUsuario;
DROP PROCEDURE IF EXISTS spVerCategorias;
DROP PROCEDURE IF EXISTS spNuevaCategoria;
DROP PROCEDURE IF EXISTS spModificarCategoria;
DROP PROCEDURE IF EXISTS spEliminarCategoria;
DROP PROCEDURE IF EXISTS spVerVentas;
DROP PROCEDURE IF EXISTS spVerVentaYProductosPorId;
DROP PROCEDURE IF EXISTS spCrearVenta;
DROP PROCEDURE IF EXISTS spModificarVenta;
DROP PROCEDURE IF EXISTS spEliminarVenta;
DROP PROCEDURE IF EXISTS spAgregarProductoAVenta;
DROP PROCEDURE IF EXISTS spEliminarProductosDeVenta;
DROP PROCEDURE IF EXISTS spModificarStockActual;
DROP PROCEDURE IF EXISTS spObtenerProductosDeVenta;
DROP PROCEDURE IF EXISTS spVerRoles;
DROP PROCEDURE IF EXISTS spCrearRol;
DROP PROCEDURE IF EXISTS spModificarRol;
DROP PROCEDURE IF EXISTS spEliminarRol;
DROP PROCEDURE IF EXISTS spVerFormasPago;
DROP PROCEDURE IF EXISTS spNuevaFormaPago;
DROP PROCEDURE IF EXISTS spModificarFormaPago;
DROP PROCEDURE IF EXISTS spEliminarFormaPago;

-- CREAR TABLAS

CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `inhabilitado` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `id_rol` int NOT NULL,
  `inhabilitado` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `password_UNIQUE` (`password`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `id_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `categorias_producto` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  `inhabilitado` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `formas_pago` (
  `id_forma_pago` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) NOT NULL,
  `inhabilitado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_forma_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(100) NOT NULL,
  `stock_actual` int NOT NULL,
  `precio_lista` decimal(10,2) DEFAULT NULL,
  `descuento_uno` decimal(10,2) DEFAULT NULL,
  `descuento_dos` decimal(10,2) DEFAULT NULL,
  `incremento` decimal(10,2) DEFAULT NULL,
  `precio_final` decimal(10,2) DEFAULT NULL,
  `id_categoria` int NOT NULL,
  `modificado_por` int DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `inhabilitado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_producto`),
  KEY `id_categoria` (`id_categoria`),
  KEY `modificado_por` (`modificado_por`),
  CONSTRAINT `id_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_producto` (`id_categoria`),
  CONSTRAINT `modificado_por` FOREIGN KEY (`modificado_por`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ventas` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `venta_total` decimal(10,2) NOT NULL,
  `id_forma_pago` int NOT NULL,
  `cantidad_total` int NOT NULL,
  `inhabilitada` tinyint DEFAULT FALSE,
  PRIMARY KEY (`id_venta`),
  KEY `id_forma_pago` (`id_forma_pago`),
  CONSTRAINT `id_forma_pago` FOREIGN KEY (`id_forma_pago`) REFERENCES `formas_pago` (`id_forma_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ventas_producto` (
  `id_venta_producto` int NOT NULL AUTO_INCREMENT,
  `id_venta` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `venta_subtotal` decimal(10,2) NOT NULL,
  `inhabilitada` tinyint DEFAULT FALSE,
  PRIMARY KEY (`id_venta_producto`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `id_venta` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CARGAR DATOS DE PRUEBA
INSERT INTO categorias_producto (descripcion) VALUES
('Alimento'),
('Ropa'),
('Juguetes');

INSERT INTO formas_pago (descripcion) VALUES
('Efectivo'),
('Tarjeta de Crédito'),
('Transferencia Bancaria');

INSERT INTO productos (nombre_producto, stock_actual, precio_lista, descuento_uno, descuento_dos, incremento, precio_final, id_categoria) VALUES
('Alimento Gato 1Kg', 100, 1500.00, 10.00, 5.00, 15.00, 1600.00, 1),
('Chaleco Perro', 200, 50.00, 5.00, 2.00, 10.00, 52.00, 2),
('Muñeco Perro', 150, 30.00, 5.00, 3.00, 8.00, 33.00, 3);

INSERT INTO roles (nombre) VALUES
('Administrador'),
('Editor'),
('Lector');

INSERT INTO usuarios (username, password, id_rol) VALUES
('admin@example.com', 'password123', 1),
('vendedor@example.com', 'password456', 2),
('cliente@example.com', 'password789', 3);

INSERT INTO ventas (fecha, venta_total, id_forma_pago, cantidad_total, inhabilitada) VALUES
('2024-10-01', 1600.00, 2, 3, 0),
('2024-10-02', 137.00, 1, 3, 0),
('2024-10-03', 99.00, 3, 2, 0);

INSERT INTO ventas_producto (id_venta, id_producto, cantidad, venta_subtotal) VALUES
(1, 1, 1, 1600.00),
(2, 2, 2, 104.00),
(3, 3, 3, 99.00),
(2, 3, 1, 33.00);

-- STORE PROCEDURES
-- GET ALL
DELIMITER //
CREATE PROCEDURE spVerProductos(
	  IN filaInicial INT, 
    IN limite INT, 
    IN colOrden VARCHAR(50), 
    IN dirOrden VARCHAR(4),
    IN busqueda VARCHAR(100)
    )
BEGIN
	  DECLARE colValida VARCHAR(50);
    DECLARE dirValida VARCHAR(4);
    
    -- Elige un valor predeterminado si no hay valor de entrada
    SET limite = IFNULL(limite, 10);
    SET filaInicial = IFNULL(filaInicial, 0);
    SET busqueda = IFNULL(busqueda, '');

    -- Validar columna de ordenamiento
    SET colValida = CASE 
        WHEN colOrden = 'nombre_producto' THEN 'nombre_producto'
        WHEN colOrden = 'precio_lista' THEN 'precio_lista'
        WHEN colOrden = 'precio_final' THEN 'precio_final'
        WHEN colOrden = 'stock_actual' THEN 'stock_actual'
        WHEN colOrden = 'categoria' THEN 'categoria'
        ELSE 'nombre_producto'
    END;

    -- Validar direccion de ordenamiento
    SET dirValida = CASE 
        WHEN UPPER(dirOrden) = 'ASC' THEN 'ASC'
        WHEN UPPER(dirOrden) = 'DESC' THEN 'DESC'
        ELSE 'ASC'
    END;

    SET @consulta = CONCAT('
        SELECT
            p.id_producto,
            p.nombre_producto,
            p.precio_lista,
            p.precio_final,
            p.stock_actual,
            p.id_categoria
        FROM productos AS p
        WHERE p.inhabilitado = 0
        AND p.nombre_producto LIKE "%', busqueda, '%"
        ORDER BY ', colValida, ' ', dirValida, '
        LIMIT ', filaInicial, ', ', limite
        );

    PREPARE sp_get_productos FROM @consulta;
    EXECUTE sp_get_productos;
    DEALLOCATE PREPARE sp_get_productos;
END//
DELIMITER ;

-- GET BY ID
DELIMITER //
CREATE PROCEDURE spVerProductoPorId(
    IN id INT
    )
BEGIN
    SET @consulta = CONCAT('
        SELECT 
            p.id_producto,
            p.nombre_producto,
            p.stock_actual,
            p.precio_lista,
            p.descuento_uno,
            p.descuento_dos,
            p.incremento,
            p.precio_final,
            p.id_categoria,
            p.modificado_por,
            p.fecha_modificacion,
            p.inhabilitado
        FROM productos AS p
        WHERE p.id_producto = ? AND p.inhabilitado = 0
    ');

    PREPARE sp_get_producto_by_id FROM @consulta;
    SET @producto_id = id;
    EXECUTE sp_get_producto_by_id USING @producto_id;
    DEALLOCATE PREPARE sp_get_producto_by_id;
END//
DELIMITER ;

-- UPDATE
DELIMITER //
CREATE PROCEDURE spModificarProducto(
   IN nombreProducto VARCHAR(100), IN stockActual INT, IN precioLista DECIMAL(10,2), 
   IN descuentoUno DECIMAL(10,2), IN descuentoDos DECIMAL(10,2),
   IN incremento DECIMAL(10,2), IN precioFinal DECIMAL(10,2),
   IN idCategoria INT, IN modificadoPor INT, IN idProducto INT)
BEGIN 
		UPDATE productos 
        SET nombre_producto = nombreProducto, stock_actual = stockActual, precio_lista = precioLista, 
        descuento_uno = descuentoUno, descuento_dos = descuentoDos, incremento = incremento,
        precio_final = precioFinal, id_categoria = idCategoria,
        modificado_por = modificadoPor, fecha_modificacion = CURRENT_TIMESTAMP()
    WHERE id_producto = idProducto;
END//
DELIMITER ;

-- INSERT
DELIMITER //
CREATE PROCEDURE spNuevoProducto(
    IN nombre_producto VARCHAR(100),
    IN stock_actual INT,
    IN precio_lista DECIMAL(10, 2),
    IN descuento_uno DECIMAL(10, 2),
    IN descuento_dos DECIMAL(10, 2),
    IN incremento DECIMAL(10, 2),
    IN precio_final DECIMAL(10, 2),
    IN id_categoria INT)
BEGIN
    INSERT INTO productos (nombre_producto, stock_actual, precio_lista, descuento_uno, 
    descuento_dos, incremento, precio_final, id_categoria)
    VALUES (nombre_producto, stock_actual, precio_lista, descuento_uno, 
    descuento_dos, incremento, precio_final, id_categoria);
END //
DELIMITER ;

-- SOFT DELETE
DELIMITER //
CREATE PROCEDURE spEliminarProducto(IN idProducto INT)
BEGIN 
		UPDATE productos SET inhabilitado = TRUE WHERE id_producto = idProducto;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE spVerUsuarios()
BEGIN 
		SELECT * FROM usuarios WHERE inhabilitado = FALSE;
END//
DELIMITER ;

-- GET USUARIO BY ID
DELIMITER //
CREATE PROCEDURE spVerUsuarioPorId(
   IN idUsuario INT)
BEGIN 
	SELECT username, id_rol
    FROM usuarios
    WHERE id_usuario = idUsuario AND inhabilitado = FALSE;
END//
DELIMITER ;

-- INSERT USUARIO 
DELIMITER //
CREATE PROCEDURE spNuevoUsuario(
    IN username VARCHAR(50),
    IN password VARCHAR(60),
    IN idRol INT
)
BEGIN
    INSERT INTO usuarios (username, password, id_rol)
    VALUES (username, password, idRol);
END //
DELIMITER ;

-- UPDATE USUARIO
DELIMITER //
CREATE PROCEDURE spModificarUsuario(
    IN username VARCHAR(50),
    IN password VARCHAR(60),
    IN idRol INT,
    IN idUsuario INT
)
BEGIN
    UPDATE usuarios
        SET username = username, password = password, id_rol = idRol
    WHERE id_usuario = idUsuario;
END //
DELIMITER ;

--SOFT DELETE USUARIO
DELIMITER //
CREATE PROCEDURE spEliminarUsuario(IN idUsuario INT)
BEGIN 
		UPDATE usuarios SET inhabilitado = TRUE WHERE id_usuario = idUsuario;
END//
DELIMITER ;

-- SP CRUD CATEGORIAS
-- GET ALL
DELIMITER //
CREATE PROCEDURE `spVerCategorias`()
BEGIN
	SELECT * FROM categorias_producto;
END//
DELIMITER ;

-- INSERT
DELIMITER //
CREATE PROCEDURE `spNuevaCategoria`(
	IN descripcion VARCHAR(50)
)
BEGIN
	INSERT INTO categorias_producto (descripcion)
    VALUES (descripcion);
END//
DELIMITER ;

-- UPDATE
DELIMITER //
CREATE PROCEDURE `spModificarCategoria`(
	IN idCategoria INT,
    IN descripcion VARCHAR(50)
)
BEGIN
		UPDATE categorias_producto
        SET descripcion = descripcion
        WHERE id_categoria = idCategoria;
END//
DELIMITER ;

-- SOFT DELETE
DELIMITER //
CREATE PROCEDURE `spEliminarCategoria`(
	IN idCategoria INT
)
BEGIN
	UPDATE categorias_producto SET inhabilitado = TRUE WHERE id_categoria = idCategoria;
END//
DELIMITER ;

-- GET ALL VENTAS
DELIMITER //
CREATE PROCEDURE spVerVentas()
BEGIN 
		SELECT v.id_venta, v.venta_total, v.cantidad_total, fp.descripcion as forma_pago, v.fecha 
        FROM ventas v
        JOIN formas_pago fp
        ON v.id_forma_pago = fp.id_forma_pago
        WHERE inhabilitada = FALSE;
END//
DELIMITER ;

-- GET VENTAS BY ID
DELIMITER //
CREATE PROCEDURE spVerVentaYProductosPorId(
   IN idVenta INT)
BEGIN 
	SELECT 
		p.id_producto, p.nombre_producto, p.stock_actual, p.precio_lista, p.precio_final, 
        vp.cantidad, vp.venta_subtotal, vp.id_venta_producto, 
        v.id_venta, v.fecha, v.cantidad_total, v.venta_total, 
        fp.descripcion as forma_pago, fp.id_forma_pago
    FROM ventas v 
    JOIN ventas_producto vp 
    ON v.id_venta = vp.id_venta 
    JOIN formas_pago fp
    ON v.id_forma_pago = fp.id_forma_pago
    JOIN productos p 
    ON vp.id_producto = p.id_producto
    WHERE vp.id_venta = idVenta AND vp.inhabilitada = FALSE;
END//
DELIMITER ;

-- INSERT VENTA
DELIMITER //
CREATE PROCEDURE spCrearVenta(
    IN ventaTotal DECIMAL(10, 2),
    IN cantidadTotal INT,
    IN formaPago INT)
BEGIN
    INSERT INTO ventas (venta_total, cantidad_total, id_forma_pago, fecha)
    VALUES (ventaTotal, cantidadTotal, formaPago, CURRENT_TIMESTAMP());
    SELECT LAST_INSERT_ID() AS id_venta;
END //
DELIMITER ;

-- UPDATE VENTA
DELIMITER //
CREATE PROCEDURE spModificarVenta(
    IN idVenta INT,
    IN ventaTotal DECIMAL(10,2),
    IN cantidadTotal INT,
    IN idFormaPago INT
)
BEGIN
    UPDATE ventas 
    SET venta_total = ventaTotal, cantidad_total = cantidadTotal, id_forma_pago = idFormaPago
    WHERE id_venta = idVenta;
END//
DELIMITER ;

-- SOFT DELETE VENTA
DELIMITER //
CREATE PROCEDURE spEliminarVenta(IN idVenta INT)
BEGIN 
    UPDATE ventas SET inhabilitada = TRUE WHERE id_venta = idVenta;
    UPDATE ventas_producto SET inhabilitada = TRUE WHERE id_venta = idVenta;
END//
DELIMITER ;

-- SP Obtener productos asociados a una venta
DELIMITER //
CREATE PROCEDURE spObtenerProductosDeVenta(
    IN idVenta INT
)
BEGIN
    SELECT id_producto, cantidad
    FROM ventas_producto
    WHERE id_venta = idVenta;
END //
DELIMITER ;

-- INSERT VENTAS_PRODUCTO
DELIMITER //
CREATE PROCEDURE spAgregarProductoAVenta(
    IN idVenta INT,
    IN idProducto INT,
    IN cantidad INT,
    IN ventaSubTotal DECIMAL(10, 2)
)
BEGIN
    INSERT INTO ventas_producto (id_venta, id_producto, cantidad, venta_subtotal)
    VALUES (idVenta, idProducto, cantidad, ventaSubTotal);

    SELECT LAST_INSERT_ID() AS id_venta_producto;

    CALL spModificarStockActual(idProducto, cantidad);

END //
DELIMITER ;

-- DELETE VENTAS_PRODUCTO
DELIMITER //
CREATE PROCEDURE spEliminarProductosDeVenta(
    IN idVenta INT
)
BEGIN
    DELETE FROM 
    ventas_producto WHERE id_venta = idVenta;
END //
DELIMITER ;

-- UPDATE PRODUCTOS - STOCK ACTUAL
DELIMITER //
CREATE PROCEDURE spModificarStockActual(
	IN idProducto INT,
    IN cantidadADescontar INT
)
BEGIN
		UPDATE productos
        SET stock_actual = stock_actual - cantidadADescontar
        WHERE id_producto = idProducto;
END//
DELIMITER ;

-- SP GET FORMAS PAGO
DELIMITER //
CREATE PROCEDURE spVerFormasPago()
BEGIN
	SELECT * FROM formas_pago;
END//
DELIMITER ;

-- SP POST FORMAS PAGO
DELIMITER //
CREATE PROCEDURE `spNuevaFormaPago`(
	IN descripcion VARCHAR(50)
)
BEGIN
	INSERT INTO formas_pago (descripcion)
    VALUES (descripcion);
END//
DELIMITER ;

-- SP PUT FORMAS PAGO
DELIMITER //
CREATE PROCEDURE `spModificarFormaPago`(
	IN idFormaPago INT,
    IN descripcion VARCHAR(50)
)
BEGIN
	UPDATE formas_pago
	SET descripcion = descripcion
	WHERE id_forma_pago = idFormaPago;
END//
DELIMITER ;

-- SP DELETE FORMAS PAGO
DELIMITER //
CREATE PROCEDURE `spEliminarFormaPago`(
	IN idFormaPago INT
)
BEGIN
	UPDATE formas_pago SET inhabilitado = TRUE WHERE id_forma_pago = idFormaPago;
END//
DELIMITER ;

-- SP GET ROLES
DELIMITER //
CREATE PROCEDURE spVerRoles()
BEGIN
	SELECT * FROM roles
    WHERE inhabilitado = FALSE;
END//
DELIMITER ;

-- SP INSERT ROL
DELIMITER //
CREATE PROCEDURE spCrearRol(
    IN nombre VARCHAR(50)
)
BEGIN
	INSERT INTO roles (nombre)
    VALUES (nombre);
END//
DELIMITER ;

-- SP UPDATE ROL
DELIMITER //
CREATE PROCEDURE spModificarRol(
    IN nombre VARCHAR(50),
    IN idRol INT
)
BEGIN
    UPDATE roles
        SET nombre = nombre
    WHERE id_rol = idRol;
END //
DELIMITER ;

--SP DELETE ROL
DELIMITER //
CREATE PROCEDURE spEliminarRol(IN idRol INT)
BEGIN 
		UPDATE roles SET inhabilitado = TRUE WHERE id_rol = idRol;
END//
DELIMITER ;