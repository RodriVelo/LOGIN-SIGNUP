import express from "express";
import { getTurnos, bloquearTurno } from "../controllers/turnosController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getTurnos",getTurnos)
// router.post("/postReservar", postReservarTurno)


router.put("/bloquearTurno/:turno_id", bloquearTurno)
export default router;