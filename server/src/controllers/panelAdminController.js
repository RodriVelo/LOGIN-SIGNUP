import { getStatsModel } from "../models/panelAdminModels.js";

export const getStats = async (req, res) => {
  try {
    const stats = await getStatsModel();
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error en getStats",
    });
  }
};
