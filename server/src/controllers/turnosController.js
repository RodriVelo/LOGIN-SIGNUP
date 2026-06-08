import { getTurnosModel , bloquearTurnoModel } from "../models/turnosModels.js"

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


export const bloquearTurno = async (req, res) =>{

  try {
    const nuevoEstado  = req.body.estado
    const { turno_id } = req.params;
    await bloquearTurnoModel(turno_id,nuevoEstado);
    res.json({
      sucess: true,
      message: "Turno bloqueado correctamente"
    })

  }catch(error){
    console.log(error);
    
    res.status(500).json({
      sucess:false,
      message:"Error al bloquear turno"
    })
  }
}