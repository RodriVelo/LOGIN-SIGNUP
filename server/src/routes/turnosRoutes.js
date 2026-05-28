import express from "express";
import { getTurnos} from "../controllers/turnosController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getTurnos",getTurnos)
// router.post("/postReservar", postReservarTurno)


export default router;