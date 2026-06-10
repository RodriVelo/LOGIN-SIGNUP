import express from "express";
import { getCanchas, editarCancha } from "../controllers/canchasController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getCanchas",getCanchas)

// ----- RUTAS ADMIN ------

router.put(`/editarCancha/:cancha_id`, authenticateToken, editarCancha )


export default router;