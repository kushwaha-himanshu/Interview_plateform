import express from "express";

import {
  startInterview,
} from "../controllers/interview.controller.js";

import {
  verifyJwt,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/start",
  verifyJwt,
  startInterview
);

export default router;