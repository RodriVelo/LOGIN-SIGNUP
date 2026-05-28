
import { getCanchasModel } from "../models/canchasModels.js";

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

