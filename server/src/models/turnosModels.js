import { pool } from "../db/connection.js";

export const getTurnosModel = async (fecha) => {
  try {

    // Primero liberar turnos con reservas expiradas
    await pool.query(
      `UPDATE turno t
       JOIN reserva r ON r.turno_id = t.id
       SET t.estado = 'disponible', r.estado = 'cancelada'
       WHERE r.estado = 'pendiente' AND r.expires_at < NOW()`
    );

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
        LEFT JOIN reserva r ON r.turno_id = t.id AND r.estado != 'cancelada'
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



export const generarTurnosParaCancha = async (canchaId) => {
  try {
    for (let dia = 0; dia < 14; dia++) {
      const fecha = new Date()
      fecha.setUTCHours(0, 0, 0, 0)
      fecha.setUTCDate(fecha.getUTCDate() + dia)
      const fechaFormateada = fecha.toISOString().split("T")[0]

      for (let hora = 10; hora < 23; hora++) {
        const horario_inicio = `${String(hora).padStart(2, "0")}:00:00`
        const horario_fin = `${String(hora + 1).padStart(2, "0")}:00:00`

        try {
          await pool.query(
            `INSERT INTO turno (cancha_id, fecha, horario_inicio, horario_fin, estado)
             VALUES (?, ?, ?, ?, 'disponible')`,
            [canchaId, fechaFormateada, horario_inicio, horario_fin]
          )
        } catch (error) {
          if (error.code !== "ER_DUP_ENTRY") throw error
        }
      }
    }
    console.log(`✅ Turnos generados para cancha ${canchaId}`)
  } catch (error) {
    console.log("❌ Error generando turnos para cancha:", error.message)
  }
}