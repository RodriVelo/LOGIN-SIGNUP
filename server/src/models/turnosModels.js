import { pool } from "../db/connection.js";

export const getTurnosModel = async (fecha) => {
  try {

    const [rows] = await pool.query(
      `SELECT 
          t.id,
          t.cancha_id,
          t.fecha,
          t.horario_inicio,
          t.horario_fin,
          t.estado,
          r.id AS reserva_id,
          u.nombre AS nombre_usuario,
          u.telefono AS telefono_usuario,
          u.email AS email_usuario
        FROM turno t
        LEFT JOIN reserva r ON r.turno_id = t.id
        LEFT JOIN usuario u ON u.id = r.usuario_id
        WHERE t.fecha = ?`,
      [fecha]
    );

    return rows;

  } catch (error) {
    throw error;
  }
};

export const bloquearTurnoModel = async (turno_id, nuevoEstado) =>{
  try {
    await pool.query(
      `UPDATE turno
      SET estado = ? 
      WHERE id = ?`, [nuevoEstado,turno_id]
    )
  } catch (error) {
    throw error;
  }
}

