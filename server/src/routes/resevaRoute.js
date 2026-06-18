import express from "express";
import { realizarReserva, cancelarReserva, iniciarPago, webhook, misReservas } from "../controllers/reservasController.js"
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------ RUTAS CLIENTE -------
router.post(`/realizarReserva`, authenticateToken, realizarReserva)
router.post(`/iniciarPago`, authenticateToken, iniciarPago)
router.get(`/misreservas`, authenticateToken, misReservas)
// ------ WEBHOOK (sin autenticación, lo llama MP directamente) -------
router.post(`/webhook`, webhook)

// ------ RUTAS ADMIN -------
router.patch("/cancelarReserva/:reserva_id", authenticateToken, cancelarReserva);
export default router;