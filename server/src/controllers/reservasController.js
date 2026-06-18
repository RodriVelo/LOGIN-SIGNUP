import {realizarReservaModel, cancelarReservaModel} from "../models/reservasModels.js"
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { iniciarReservaModel, confirmarReservaModel , misReservasModel} from '../models/reservasModels.js';

// import detenv from "dotenv"
// detenv.config()

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export const iniciarPago = async (req, res) => {
  try {
    const { usuario_id, turno_id, nombre_cancha, precio } = req.body;
    console.log('1. Datos recibidos:', { usuario_id, turno_id, nombre_cancha, precio });

    const reservaId = await iniciarReservaModel({ usuario_id, turno_id });
    console.log('2. Reserva creada con id:', reservaId);

    const preference = new Preference(mp);
    const notifUrl = `${process.env.API_URL}/reservas/webhook`;
      console.log('notification_url exacta:', JSON.stringify(notifUrl));
      console.log('longitud:', notifUrl.length);
      console.log('char codes inicio:', [...notifUrl.slice(0,5)].map(c => c.charCodeAt(0)));
    const response = await preference.create({
      body: {
        items: [{
          title: `Reserva ${nombre_cancha}`,
          quantity: 1,
          unit_price: Number(precio),
        }],
        back_urls: {
          success: `${process.env.CLIENT_URL}/`,
          failure: `${process.env.CLIENT_URL}/`,
          pending: `${process.env.CLIENT_URL}/`,
        },
        notification_url: `${process.env.API_URL}/reservas/webhook`,
        external_reference: String(reservaId),
      }
    });

    console.log('3. Preferencia creada OK, init_point:', response.init_point);

    res.json({ success: true, init_point: response.init_point });

  } catch (error) {
    console.log('ERROR en iniciarPago:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const webhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const payment = new Payment(mp);
      const pago = await payment.get({ id: data.id });

      if (pago.status === 'approved') {
        const reservaId = pago.external_reference;
        await confirmarReservaModel(reservaId, data.id);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

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

  const id = req.params.reserva_id;
  try {

    await cancelarReservaModel(id);
    res.json({ success: true, 
      message: "Reserva cancelada correctamente"});
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Error al cancelar reserva" });
  }
};

export const misReservas = async (req,res) =>{
  const user= req.user
  try {
    const reservas = await misReservasModel(user);
    console.log("esto devuelve model paaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(reservas)
    res.json({
      success: true,
      message: "Reservas obtenidas correctamente",
      reservas
    })
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "Error en mis reservas"
    })
  }
}