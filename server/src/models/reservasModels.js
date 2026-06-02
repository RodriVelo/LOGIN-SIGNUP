import { pool } from "../db/connection.js";

export const realizarReservaModel = async ({ usuario_id, turno_id, fecha, horario_inicio }) => {

  // 1. Verificar que el turno existe y está disponible
  const [turnos] = await pool.query(
    `SELECT * FROM turno WHERE id = ? AND estado = 'disponible'`,
    [turno_id]
  );

  if (turnos.length === 0) {
    throw new Error("El turno no existe o ya fue reservado");
  }

  // 2. Crear la reserva
  await pool.query(
    `INSERT INTO reserva (usuario_id, turno_id, estado, created_at) 
     VALUES (?, ?, 'confirmada', NOW())`,
    [usuario_id, turno_id]
  );

  // 3. Marcar el turno como reservado
  await pool.query(
    `UPDATE turno SET estado = 'reservado' WHERE id = ?`,
    [turno_id]
  );
};


export const cancelarReservaModel = async (reserva_id) => {

  const [reserva] = await pool.query(
    "SELECT turno_id FROM reserva WHERE id = ?",
    [reserva_id]
  );

  const turno_id = reserva[0].turno_id;

  await pool.query(
    "DELETE FROM reserva WHERE id = ?",
    [reserva_id]
  );

  await pool.query(
    "UPDATE turno SET estado = 'disponible' WHERE id = ?",
    [turno_id]
  );
};