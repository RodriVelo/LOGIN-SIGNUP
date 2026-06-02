import express from "express";
import { getStats } from "../controllers/panelAdminController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(`/getStats`, getStats)
export default router;