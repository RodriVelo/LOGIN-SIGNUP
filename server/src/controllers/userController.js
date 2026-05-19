import { getUserModel } from "../models/userModels.js";

export const getUser = async (req, res) => {


  try {
    const response = await getUserModel(req.user.id);

    res.json({
      success: true,
      user: response,
    });

  } catch (error) {
    console.error("Error getting user:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};