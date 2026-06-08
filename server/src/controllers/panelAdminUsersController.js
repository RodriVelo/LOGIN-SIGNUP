import { cambiarEstadoUsuarioModel } from "../models/panelAdminUsersModel.js";

export const cambiarEstadoUsuario = async (req, res) => {
  const nuevoEstado = req.body.estado;
  const id_user = req.params.id;

  try {
    await cambiarEstadoUsuarioModel(id_user, nuevoEstado);
    res.json({
      success: true,
      message: "Nuevo estado usuario",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado usuario",
    });
  }
};