import { pool } from "../db/connection.js";

export const getCanchasModel = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, tipo, precio, activa FROM cancha"
    );

    return rows;

  } catch (error) {
    throw error;
  }
};

export const editarCanchaModel = async (id, canchaData) => {
  try {

    await pool.query(
      `
      UPDATE cancha
      SET nombre = ?, precio = ?, activa = ?
      WHERE id = ?
      `,
      [
        canchaData.nombre,
        canchaData.precio,
        canchaData.activa,
        id
      ]
    );
  } catch (error) {
    throw error;
  }
};

export const crearCanchaModel = async (canchaNueva) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO cancha (nombre, tipo, precio, activa) VALUES (?, ?, ?, ?)',
      [canchaNueva.nombre, canchaNueva.tipo, canchaNueva.precio, canchaNueva.activa]
    );

    const [rows] = await pool.query('SELECT * FROM cancha WHERE id = ?', [result.insertId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const borrarCanchaModel = async (cancha_id) => {
  try {
    const [reservas] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM reserva r
      JOIN turno t ON r.turno_id = t.id
      WHERE t.cancha_id = ? AND r.estado IN ('pendiente', 'confirmada')
    `, [cancha_id]);

    if (reservas[0].total > 0) {
      throw new Error('La cancha tiene reservas activas');
    }

    await pool.query(`DELETE FROM cancha WHERE id = ?`, [cancha_id]);
  } catch (error) {
    throw error;
  }
};