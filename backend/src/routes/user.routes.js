import express from "express";
import {register,login,googleAuth,logout } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
const router=express.Router();

router.post("/register",register);
router.post("/login",login);

router.post("/google",googleAuth);
router.post("/logout",verifyJwt,logout);


export default router;