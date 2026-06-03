import express from "express";
import { realizarReserva , cancelarReserva } from "../controllers/reservasController.js"
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ------ RUTAS CLIENTE -------
router.post(`/realizarReserva`, authenticateToken, realizarReserva)

// ------ RUTAS ADMIN -------

router.patch("/cancelarReserva/:reserva_id", authenticateToken, cancelarReserva);

export default router;