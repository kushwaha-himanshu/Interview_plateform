import express from"express";
import {createPaymentOrder }from "../controllers/payment_controller.js"
import    {verifyPayment,getPaymentdetails} from "../controllers/payment_controller.js"
import { verifyJwt } from "../middlewares/authMiddleware.js";


    const router=express.Router();

    router.post("/create-order",createPaymentOrder)
    router.post("/verify-payment",verifyJwt,verifyPayment)
    router.get("/payment/:id", getPaymentdetails);

    export default router