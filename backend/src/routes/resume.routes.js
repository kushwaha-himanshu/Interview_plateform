import express from "express";

import {
  uploadResume,
  getMyResume,
} from "../controllers/resume.controller.js";

import upload from "../middlewares/uploadMiddleware.js";

import {
  verifyJwt,
} from "../middlewares/authMiddleware.js";


const router = express.Router();


router.post(
  "/upload",
  verifyJwt,
  upload.single("file"),
  uploadResume
);
router.get(
  "/",
  verifyJwt,
  getMyResume
);

export default router;