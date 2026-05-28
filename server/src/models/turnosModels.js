import { pool } from "../db/connection.js";

export const getTurnosModel = async (fecha) => {
  try {

    const [rows] = await pool.query(
      `SELECT id, cancha_id, fecha, horario_inicio, horario_fin, estado
       FROM turno
       WHERE fecha = ?`,
      [fecha]
    );

    return rows;

  } catch (error) {
    throw error;
  }
};

