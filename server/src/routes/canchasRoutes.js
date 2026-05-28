import express from "express";
import { getCanchas } from "../controllers/canchasController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getCanchas",getCanchas)



export default router;