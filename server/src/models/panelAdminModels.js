import { pool } from "../db/connection.js";

export const getStatsModel = async () => {
  try {
    const [[{ totalUsuarios }]] = await pool.query(
      `SELECT COUNT(*) as totalUsuarios FROM usuario`
    );

    const hoy = new Date().toISOString().split("T")[0];

    const [[{ reservasHoy }]] = await pool.query(
      `SELECT COUNT(*) as reservasHoy
       FROM reserva r
       JOIN turno t ON r.turno_id = t.id
       WHERE t.fecha = ?`,
      [hoy]
    );

            const [[{ turnosLibresHoy }]] = await pool.query(
            `SELECT COUNT(*) as turnosLibresHoy
            FROM turno t
            JOIN cancha c ON t.cancha_id = c.id
            WHERE t.fecha = ? 
                AND t.estado = 'disponible'
                AND c.activa = 1`,
            [hoy]
            );

    const [[{ ingresosMes }]] = await pool.query(
      `SELECT COALESCE(SUM(c.precio), 0) as ingresosMes
       FROM reserva r
       JOIN turno t ON r.turno_id = t.id
       JOIN cancha c ON t.cancha_id = c.id
       WHERE MONTH(t.fecha) = MONTH(CURDATE())
         AND YEAR(t.fecha) = YEAR(CURDATE())
         AND r.estado = 'confirmada'`
    );

    return { totalUsuarios, reservasHoy, turnosLibresHoy, ingresosMes };
  } catch (error) {
    throw error;
  }
};


export const getUsersModel = async () => {
  try {

    const [rows] = await pool.query(
      `SELECT
          u.id,
          u.nombre,
          u.apellido,
          u.nro_documento,
          u.email,
          u.telefono,
          r.tipo AS rol
      FROM usuario u
      JOIN rol r ON u.id_rol = r.id`
    );

    return rows;
  } catch (error) {
    throw error;
  }
};


export const getReservasHoyModel = async () => {
  try {
    
 
    const [rows] = await pool.query(
      `SELECT 
        r.id,
        r.estado,
        u.nombre,
        u.apellido,
        u.telefono,
        t.horario_inicio,
        c.nombre AS cancha_nombre
      FROM reserva r
      JOIN turno t ON t.id = r.turno_id
      JOIN usuario u ON u.id = r.usuario_id
      JOIN cancha c ON c.id = t.cancha_id
      WHERE t.fecha = CURDATE()`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getHistorialModel = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT 
          r.id,
          r.estado,
          u.nombre,
          u.apellido,
          u.telefono,
          t.fecha,
          t.horario_inicio,
          t.cancha_id,
          c.nombre AS cancha_nombre,
          c.precio
        FROM reserva r
        JOIN turno t ON t.id = r.turno_id
        JOIN usuario u ON u.id = r.usuario_id
        JOIN cancha c ON c.id = t.cancha_id
        ORDER BY t.fecha DESC`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};


export const getIngresosModel = async (mes, anio) => {
  const [resumen] = await pool.query(
    `SELECT 
      COUNT(*) AS totalReservas,
      SUM(c.precio) AS totalMes,
      AVG(c.precio) AS promedioPorReserva
    FROM reserva r
    JOIN turno t ON t.id = r.turno_id
    JOIN cancha c ON c.id = t.cancha_id
    WHERE r.estado = 'confirmada'
      AND MONTH(t.fecha) = ?
      AND YEAR(t.fecha) = ?`,
    [mes, anio]
  );

  const [porCancha] = await pool.query(
    `SELECT 
      c.id AS cancha_id,
      c.nombre AS cancha_nombre,
      SUM(c.precio) AS total
    FROM reserva r
    JOIN turno t ON t.id = r.turno_id
    JOIN cancha c ON c.id = t.cancha_id
    WHERE r.estado = 'confirmada'
      AND MONTH(t.fecha) = ?
      AND YEAR(t.fecha) = ?
    GROUP BY c.id, c.nombre`,
    [mes, anio]
  );

  return { ...resumen[0], porCancha };
};