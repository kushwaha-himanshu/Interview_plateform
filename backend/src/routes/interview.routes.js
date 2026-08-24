import express from "express";

import {
  startInterview,
  submitInterviewAnswer,
  getInterviewReport,
  getInterviewHistory
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
router.post(
  "/:interviewId/answer",
  verifyJwt,
  submitInterviewAnswer
);
router.get(
  "/:interviewId/report",
  verifyJwt,
  getInterviewReport
);

router.get(
  "/history",
  verifyJwt,
  getInterviewHistory
);

export default router;