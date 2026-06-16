import express from "express";
import { getStats , getUsers , getReservasHoy, getHistorial, getIngresos, getReservasPendientes, getOcupacionCanchas} from "../controllers/panelAdminController.js";
import { cambiarEstadoUsuario } from "../controllers/panelAdminUsersController.js"
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(`/getStats`,authenticateToken, getStats)

router.get("/getUsers", authenticateToken, getUsers)
router.get('/getReservasHoy', authenticateToken, getReservasHoy)
router.get('/getHistorial', authenticateToken, getHistorial)
router.get("/getIngresos", authenticateToken, getIngresos)
router.get('/getReservasPendientes', authenticateToken, getReservasPendientes)
router.get('/getOcupacionCanchas', authenticateToken, getOcupacionCanchas)



router.patch("/users/:id/cambiarEstado", authenticateToken, cambiarEstadoUsuario)


export default router;