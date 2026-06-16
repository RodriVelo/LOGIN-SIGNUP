import express from "express";
import { getCanchas, editarCancha, crearCancha , borrarCancha} from "../controllers/canchasController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getCanchas",getCanchas)

// ----- RUTAS ADMIN ------

router.put(`/editarCancha/:cancha_id`, authenticateToken, editarCancha)
router.post(`/crearCancha`, authenticateToken, crearCancha)
router.delete(`/borrarCancha/:cancha_id`, authenticateToken, borrarCancha)


export default router;