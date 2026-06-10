import { pool } from "../db/connection.js";


export const iniciarReservaModel = async ({ usuario_id, turno_id }) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  
  const [turnos] = await pool.query(
    `SELECT * FROM turno WHERE id = ? AND estado = 'disponible'`,
    [turno_id]
  );

  if (turnos.length === 0) {
    throw new Error("El turno no existe o ya fue reservado");
  }

  const [reservaExistente] = await pool.query(
    `SELECT id FROM reserva WHERE turno_id = ?`,
    [turno_id]
  );

  let reservaId;

  if (reservaExistente.length > 0) {
    reservaId = reservaExistente[0].id;
    await pool.query(
      `UPDATE reserva SET usuario_id = ?, estado = 'pendiente', created_at = NOW(), expires_at = ? WHERE turno_id = ?`,
      [usuario_id, expiresAt, turno_id]
    );
  } else {
    const [result] = await pool.query(
      `INSERT INTO reserva (usuario_id, turno_id, estado, created_at, expires_at) VALUES (?, ?, 'pendiente', NOW(), ?)`,
      [usuario_id, turno_id, expiresAt]
    );
    reservaId = result.insertId;
  }

  await pool.query(
    `UPDATE turno SET estado = 'reservado' WHERE id = ?`,
    [turno_id]
  );

  return reservaId;
};

export const realizarReservaModel = async ({ usuario_id, turno_id, fecha, horario_inicio }) => {

  const [turnos] = await pool.query(
    `SELECT * FROM turno WHERE id = ? AND estado = 'disponible'`,
    [turno_id]
  );

  if (turnos.length === 0) {
    throw new Error("El turno no existe o ya fue reservado");
  }

  // Verificar si ya existe una reserva cancelada para ese turno
  const [reservaExistente] = await pool.query(
    `SELECT id FROM reserva WHERE turno_id = ?`,
    [turno_id]
  );

  if (reservaExistente.length > 0) {
    // Actualizar la reserva existente en vez de insertar
    await pool.query(
      `UPDATE reserva SET usuario_id = ?, estado = 'confirmada', created_at = NOW() WHERE turno_id = ?`,
      [usuario_id, turno_id]
    );
  } else {
    // Insertar nueva reserva
    await pool.query(
      `INSERT INTO reserva (usuario_id, turno_id, estado, created_at) 
       VALUES (?, ?, 'confirmada', NOW())`,
      [usuario_id, turno_id]
    );
  }

  await pool.query(
    `UPDATE turno SET estado = 'reservado' WHERE id = ?`,
    [turno_id]
  );
};

export const confirmarReservaModel = async (reservaId, mpPaymentId) => {
  await pool.query(
    `UPDATE reserva SET estado = 'confirmada', mp_payment_id = ? WHERE id = ?`,
    [mpPaymentId, reservaId]
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