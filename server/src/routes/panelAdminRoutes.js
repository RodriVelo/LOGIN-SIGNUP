import express from "express";
import { getStats , getUsers , getReservasHoy, getHistorial, getIngresos} from "../controllers/panelAdminController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(`/getStats`,authenticateToken, getStats)

router.get("/getUsers", authenticateToken, getUsers)
router.get('/getReservasHoy', authenticateToken, getReservasHoy)
router.get('/getHistorial', authenticateToken, getHistorial)
router.get("/getIngresos", authenticateToken, getIngresos)
export default router;