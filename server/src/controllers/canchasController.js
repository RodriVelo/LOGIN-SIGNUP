
import { getCanchasModel, editarCanchaModel } from "../models/canchasModels.js";

export const getCanchas = async (req, res) => {
  try {
    
    const canchas = await getCanchasModel();

    res.json({
      success: true,
      canchas
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error al obtener canchas"
    });
  }
};

export const editarCancha = async (req, res) => {
  try {
    await editarCanchaModel(req.params.cancha_id, req.body);

    res.json({
      success: true,
      message: "Se ha editado correctamente la cancha",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error al editar la cancha",
    });
  }
};