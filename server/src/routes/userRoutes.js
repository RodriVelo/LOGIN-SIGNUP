import express from "express";
import { getUser } from "../controllers/userController.js"
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getUser",authenticateToken,getUser)

export default router;