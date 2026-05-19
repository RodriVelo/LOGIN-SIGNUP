CREATE DATABASE IF NOT EXISTS canchaFutbolJoanBiorkman;
USE canchaFutbolJoanBiorkman;

-- =========================
-- TABLA USUARIO
-- =========================

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nro_documento INT NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- TABLA TURNO
-- =========================

CREATE TABLE turno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fin TIME NOT NULL,
    disponibilidad BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- TABLA RESERVA
-- =========================

CREATE TABLE reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_turno INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reserva_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reserva_turno
        FOREIGN KEY (id_turno)
        REFERENCES turno(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- evita que un usuario reserve el mismo turno dos veces
    UNIQUE (id_usuario, id_turno)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;