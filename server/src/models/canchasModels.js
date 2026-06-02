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
    console.log(canchaData)
    console.log(id)
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