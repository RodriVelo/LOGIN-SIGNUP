import { pool } from "../db/connection.js";

export const getUserModel = async (id) => {

  try {

    const [rows] = await pool.query(
      "SELECT id, nombre, apellido, email, telefono FROM usuario WHERE id = ?",
      [id]
    );

    return rows[0];

  } catch (error) {
    throw error;
  }
};