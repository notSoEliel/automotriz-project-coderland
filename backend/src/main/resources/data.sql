-- Seed para marcas
INSERT INTO marcas (id, nombre) VALUES (1, 'Toyota') ON CONFLICT (id) DO NOTHING;
INSERT INTO marcas (id, nombre) VALUES (2, 'Ford') ON CONFLICT (id) DO NOTHING;
INSERT INTO marcas (id, nombre) VALUES (3, 'Honda') ON CONFLICT (id) DO NOTHING;

-- Seed para modelos
INSERT INTO modelos (id, nombre, marca_id) VALUES (1, 'Corolla', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO modelos (id, nombre, marca_id) VALUES (2, 'Mustang', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO modelos (id, nombre, marca_id) VALUES (3, 'Civic', 3) ON CONFLICT (id) DO NOTHING;

-- Seed para versiones
INSERT INTO versiones (id, titulo, descripcion, ano, motor, cilindrada, precio_venta_base_usd, precio_venta_base_ves, precio_alquiler_base_usd, precio_alquiler_base_ves, modelo_id) 
VALUES (1, 'Corolla LE 2024', 'Versión base económica y duradera con excelente rendimiento de combustible.', 2024, 'Combustión', '1800 cc', 22500, 996075, 45, 1992, 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO versiones (id, titulo, descripcion, ano, motor, cilindrada, precio_venta_base_usd, precio_venta_base_ves, precio_alquiler_base_usd, precio_alquiler_base_ves, modelo_id) 
VALUES (2, 'Mustang GT Premium', 'Potencia americana clásica con un motor V8 y acabados premium.', 2024, 'Combustión', '5000 cc', 48000, 2124960, 120, 5312, 2) ON CONFLICT (id) DO NOTHING;

INSERT INTO versiones (id, titulo, descripcion, ano, motor, cilindrada, precio_venta_base_usd, precio_venta_base_ves, precio_alquiler_base_usd, precio_alquiler_base_ves, modelo_id) 
VALUES (3, 'Civic Touring', 'Diseño elegante y deportivo con todas las comodidades modernas.', 2024, 'Combustión', '1500 cc', 29000, 1283830, 60, 2656, 3) ON CONFLICT (id) DO NOTHING;

-- Seed para agencias (Al menos una para poder crear vehículos)
INSERT INTO agencias (id, nombre, direccion, ciudad, latitud, longitud) 
VALUES (1, 'Agencia Sede Central', 'Av. Principal San Pedro 1010', 'Capital City', 0.0, 0.0) ON CONFLICT (id) DO NOTHING;

-- Ajustar secuencias porque insertamos con ID explícito
SELECT setval(pg_get_serial_sequence('marcas', 'id'), coalesce(max(id), 0) + 1, false) FROM marcas;
SELECT setval(pg_get_serial_sequence('modelos', 'id'), coalesce(max(id), 0) + 1, false) FROM modelos;
SELECT setval(pg_get_serial_sequence('versiones', 'id'), coalesce(max(id), 0) + 1, false) FROM versiones;
SELECT setval(pg_get_serial_sequence('agencias', 'id'), coalesce(max(id), 0) + 1, false) FROM agencias;
