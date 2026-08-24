import express from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyJwt, (req, res) => {
  const subscription = req.user?.subscription || { plan: "free", status: "active" };
  const isPro =
    subscription.plan === "pro" &&
    subscription.status === "active" &&
    (!subscription.endDate || new Date(subscription.endDate) > new Date());

  return res.status(200).json({
    success: true,
    subscription: {
      plan: subscription.plan,
      status: subscription.status,
      isPro,
      startDate: subscription.startDate,
      endDate: subscription.endDate
    }
  });
});

export default router;
