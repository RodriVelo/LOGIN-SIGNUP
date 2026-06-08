import { pool } from "../db/connection.js"

export const cambiarEstadoUsuarioModel = async (id,nuevoEstado) =>{
    try {
        await pool.query(`
            UPDATE usuario
            SET estado = ?
            WHERE id = ?`,[nuevoEstado,id])
    } catch (error) {
        throw(error)
    }
}