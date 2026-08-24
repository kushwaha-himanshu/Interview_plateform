import express from "express";
import {register,login,googleAuth,logout } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
const router=express.Router();

router.post("/register",register);
router.post("/login",login);

router.post("/google",googleAuth);
router.post("/logout",verifyJwt,logout);
router.get("/me", verifyJwt, (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      subscription: req.user.subscription
    }
  });
});


export default router;