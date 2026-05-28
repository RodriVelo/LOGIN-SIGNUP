import express from "express";
import { realizarReserva }from "../controllers/reservasController.js"
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(`/realizarReserva`, realizarReserva)


export default router;