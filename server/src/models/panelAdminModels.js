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