import express from "express";
import { chatWithCoach, getCoachContextController } from "../controllers/coachController.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/chat", verifyJwt, chatWithCoach);
router.get("/context", verifyJwt, getCoachContextController);

export default router;
