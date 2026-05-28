import {realizarReservaModel} from "../models/reservasModels.js"

export const realizarReserva = async (req, res) => {
  try {
    const { usuario_id, turno_id, fecha, horario_inicio } = req.body;

    await realizarReservaModel({ usuario_id, turno_id, fecha, horario_inicio });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};