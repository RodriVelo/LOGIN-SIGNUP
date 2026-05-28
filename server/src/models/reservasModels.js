import { pool } from "../db/connection.js";

export const realizarReservaModel = async ({ usuario_id, turno_id, fecha, horario_inicio }) => {

  // 1. Verificar que el turno existe y está disponible
  const [turnos] = await pool.query(
    `SELECT * FROM TURNO WHERE id = ? AND estado = 'disponible'`,
    [turno_id]
  );

  if (turnos.length === 0) {
    throw new Error("El turno no existe o ya fue reservado");
  }

  // 2. Crear la reserva
  await pool.query(
    `INSERT INTO RESERVA (usuario_id, turno_id, estado, created_at) 
     VALUES (?, ?, 'confirmada', NOW())`,
    [usuario_id, turno_id]
  );

  // 3. Marcar el turno como reservado
  await pool.query(
    `UPDATE TURNO SET estado = 'reservado' WHERE id = ?`,
    [turno_id]
  );
};