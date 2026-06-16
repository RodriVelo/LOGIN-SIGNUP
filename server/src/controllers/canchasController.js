
import { getCanchasModel, editarCanchaModel, crearCanchaModel, borrarCanchaModel} from "../models/canchasModels.js";
import {generarTurnosParaCancha} from "../models/turnosModels.js"

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

export const crearCancha= async (req,res) =>{
  const canchaNueva = req.body;

  try {
    const cancha = await crearCanchaModel(canchaNueva);
    await generarTurnosParaCancha(cancha.id);
    res.json({
      success:true,
      message:"Cancha creada",
      cancha
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Error al crear la cancha"
    })
  }
}

export const borrarCancha = async (req, res) => {
  const idCancha = req.params.cancha_id;
  try {
    await borrarCanchaModel(idCancha);
    res.json({
      success: true,
      message: "Cancha eliminada",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};