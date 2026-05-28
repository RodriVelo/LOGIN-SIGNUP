import { pool } from "./connection.js";

const rolTableQuery = `
CREATE TABLE IF NOT EXISTS rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const usuarioTableQuery = `
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,

    nro_documento VARCHAR(20) UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(30) UNIQUE,

    contrasena VARCHAR(255),

    google_id VARCHAR(255) UNIQUE,

    id_rol INT NOT NULL DEFAULT 2,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const canchaTableQuery = `
CREATE TABLE IF NOT EXISTS cancha (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    tipo ENUM(
        'futbol5',
        'futbol7',
        'futbol11'
    ) DEFAULT 'futbol5',

    precio DECIMAL(10,2) NOT NULL,

    activa BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const turnoTableQuery = `
CREATE TABLE IF NOT EXISTS turno (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cancha_id INT NOT NULL,

    fecha DATE NOT NULL,

    horario_inicio TIME NOT NULL,
    horario_fin TIME NOT NULL,

    estado ENUM(
        'disponible',
        'reservado',
        'cancelado'
    ) DEFAULT 'disponible',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_turno_cancha
        FOREIGN KEY (cancha_id)
        REFERENCES cancha(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE (cancha_id, fecha, horario_inicio)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const reservaTableQuery = `
CREATE TABLE IF NOT EXISTS reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,
    turno_id INT NOT NULL,

    estado ENUM(
        'pendiente',
        'confirmada',
        'cancelada'
    ) DEFAULT 'pendiente',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reserva_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reserva_turno
        FOREIGN KEY (turno_id)
        REFERENCES turno(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE (turno_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const insertDefaultRoles = async () => {
  try {

    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM rol"
    );

    if (rows[0].count === 0) {

      await pool.query(`
        INSERT INTO rol (tipo)
        VALUES ('admin'), ('cliente')
      `);

      console.log("✅ Roles insertados");

    } else {

      console.log("ℹ️ Los roles ya existen");

    }

  } catch (error) {

    console.log("❌ Error insertando roles:", error);

  }
};

const createTable = async (tableName, query) => {
  try {

    await pool.query(query);

    console.log(`✅ ${tableName} creada o ya existe`);

  } catch (error) {

    console.error(`❌ Error creando ${tableName}`);
    console.error(error.message);

  }
};

const eliminarTurnosViejos = async () => {

  try {

    await pool.query(`
      DELETE FROM turno
      WHERE fecha < CURDATE()
    `);

    console.log("🗑️ Turnos viejos eliminados");

  } catch (error) {

    console.log("❌ Error eliminando turnos viejos");
    console.log(error.message);

  }
};

const generarTurnos = async () => {
  try {

    // obtener canchas activas
    const [canchas] = await pool.query(`
      SELECT id
      FROM cancha
      WHERE activa = true
    `);

    if (canchas.length === 0) {
      console.log("⚠️ No hay canchas creadas");
      return;
    }

    const hoy = new Date();

    // próximos 14 días
    for (let dia = 0; dia < 14; dia++) {

      const fecha = new Date(hoy);

      fecha.setDate(hoy.getDate() + dia);

      const fechaFormateada = fecha
        .toISOString()
        .split("T")[0];

      // recorrer canchas
      for (const cancha of canchas) {

        // horarios de 10 a 23
        for (let hora = 10; hora < 23; hora++) {

          const horario_inicio = `${hora
            .toString()
            .padStart(2, "0")}:00:00`;

          const horario_fin = `${(hora + 1)
            .toString()
            .padStart(2, "0")}:00:00`;

          try {

            await pool.query(
              `
              INSERT INTO turno (
                cancha_id,
                fecha,
                horario_inicio,
                horario_fin
              )
              VALUES (?, ?, ?, ?)
              `,
              [
                cancha.id,
                fechaFormateada,
                horario_inicio,
                horario_fin,
              ]
            );

          } catch (error) {

            // evita error por duplicados
            if (error.code !== "ER_DUP_ENTRY") {
              throw error;
            }

          }
        }
      }
    }

    console.log("✅ Turnos generados correctamente");

  } catch (error) {

    console.log("❌ Error generando turnos");
    console.log(error.message);

  }
};

const createAllTables = async () => {
  try {

    await createTable("rol", rolTableQuery);

    await insertDefaultRoles();

    await createTable("usuario", usuarioTableQuery);

    await createTable("cancha", canchaTableQuery);

    await createTable("turno", turnoTableQuery);

    await createTable("reserva", reservaTableQuery);

    // borrar viejos
    await eliminarTurnosViejos();

    // generar faltantes
    await generarTurnos();

    console.log("✅ Todas las tablas listas");

  } catch (error) {

    console.error("❌ Error general DB");
    console.error(error.message);

  }
};
export default createAllTables;