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

