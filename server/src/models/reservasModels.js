import { pool } from "../db/connection.js";


export const iniciarReservaModel = async ({ usuario_id, turno_id }) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Verificar que el turno esté disponible
  const [turnos] = await pool.query(
    `SELECT * FROM turno WHERE id = ? AND estado = 'disponible'`,
    [turno_id]
  );

  if (turnos.length === 0) {
    throw new Error("El turno no existe o ya fue reservado");
  }

  // Siempre insertás un nuevo registro por cada intento
  const [result] = await pool.query(
    `INSERT INTO reserva (usuario_id, turno_id, estado, created_at, expires_at) 
     VALUES (?, ?, 'pendiente', NOW(), ?)`,
    [usuario_id, turno_id, expiresAt]
  );

  // Marcar el turno como reservado
  await pool.query(
    `UPDATE turno SET estado = 'reservado' WHERE id = ?`,
    [turno_id]
  );

  return result.insertId;
};

export const realizarReservaModel = async ({ usuario_id, turno_id }) => {
  const [turnos] = await pool.query(
    `SELECT * FROM turno WHERE id = ? AND estado = 'disponible'`,
    [turno_id]
  );

  if (turnos.length === 0) {
    throw new Error("El turno no existe o ya fue reservado");
  }

  const [result] = await pool.query(
    `INSERT INTO reserva (usuario_id, turno_id, estado, created_at) 
     VALUES (?, ?, 'confirmada', NOW())`,
    [usuario_id, turno_id]
  );

  await pool.query(
    `UPDATE turno SET estado = 'reservado' WHERE id = ?`,
    [turno_id]
  );

  return result.insertId;
};

export const confirmarReservaModel = async (reservaId, mpPaymentId) => {
  await pool.query(
    `UPDATE reserva SET estado = 'confirmada', mp_payment_id = ? WHERE id = ?`,
    [mpPaymentId, reservaId]
  );
};

export const cancelarReservaModel = async (id) => {
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

export const misReservasModel = async (user) => {
  try {
    const [reservas] = await pool.query(`
      SELECT 
        r.id,
        r.estado,
        r.created_at,
        t.fecha,
        t.horario_inicio,
        t.horario_fin,
        c.nombre AS cancha_nombre,
        c.tipo   AS cancha_tipo,
        c.precio
      FROM reserva r
      JOIN turno   t ON r.turno_id  = t.id
      JOIN cancha  c ON t.cancha_id = c.id
      WHERE r.usuario_id = ?
      ORDER BY t.fecha ASC, t.horario_inicio ASC
    `, [user.id]);

    return reservas;
  } catch (error) {
    throw error;
  }
};

