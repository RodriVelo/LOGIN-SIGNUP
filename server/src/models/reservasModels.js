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

export const cancelarReservaModel = async (id) => {
  console.log(id)
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Cancelar la reserva
    await conn.query(
      `UPDATE reserva SET estado = 'cancelada' WHERE id = ?`,
      [id]
    );

    // 2. Liberar el turno
    await conn.query(
      `UPDATE turno t
       JOIN reserva r ON r.turno_id = t.id
       SET t.estado = 'disponible'
       WHERE r.id = ?`,
      [id]
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};