import {realizarReservaModel, cancelarReservaModel} from "../models/reservasModels.js"

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


export const cancelarReserva = async (req, res) => {
  try {
    const { reserva_id } = req.params;

    await cancelarReservaModel(reserva_id);

    res.json({
      success: true,
      message: "Reserva cancelada correctamente",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error al cancelar reserva",
    });
  }
};