import { getTurnosModel } from "../models/turnosModels.js"

export const getTurnos = async (req, res) => {
  try {
    
    const { fecha } = req.query;

    const turnos = await getTurnosModel(fecha);

    res.json({
      success: true,
      turnos
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error al obtener turnos"
    });
  }
};

