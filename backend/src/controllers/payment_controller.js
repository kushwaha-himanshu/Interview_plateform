import Payment from "../models/payment.js";
import razorpay from "../payment/payment.js";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

// Create a new payment order
export const createPaymentOrder = async (req, res) => {
    console.log("Creating payment...");
    console.log("createPaymentOrder called");
  try {
    const { amount,currency } = req.body;
    if(!amount){
        return res.status(400).json({
            success:false, message: "Amount is required" });
        }

    const options = {
      amount: amount * 100, // Amount in smallest currency unit (e.g., cents)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,

    }
    const order = await razorpay.orders.create(options);
    return res.status(200).json({
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due,
      currency: order.currency,
      receipt: order.receipt,
      offer_id: order.offer_id,
      status: order.status,
      attempts: order.attempts,
      notes: order.notes,
      created_at: order.created_at,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return res.status(500).json({ success: false, message: "Failed to create payment order" });
  } 
}


//verify payment

export const verifyPayment = async (req, res) => {



        console.log("====== VERIFY PAYMENT ======");
        console.log("req.user =", req.user);
        console.log("req.body =", req.body);
        

    try {

        const {
            razorpayOrderId,
            razorpayPaymentId,
            signature,
            amount,
            currency,
            
        } = req.body;

        
console.log("Amount:", amount);

        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!razorpaySecret) {
            return res.status(500).json({
                success: false,
                message: "Razorpay secret is not configured on the server",
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", razorpaySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex");

        if (generatedSignature !== signature) {

            return res.status(400).json({
                success: false,
                message: "Payment Verification Failed",
            });

        }

        const payment = await Payment.create({

            orderId: razorpayOrderId,

            paymentId: razorpayPaymentId,

            amount,
            currency,
            

            status: "Success",

        });

        if (req.user?._id) {
            console.log("Updating user subscription:", req.user._id);
            await User.findByIdAndUpdate(req.user._id, {
                premium: true,
                premiumPlan: "Pro",
                premiumExpiry: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ),
                subscription: {
                    plan: "pro",
                    status: "active",
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            });
        }

        return res.status(200).json({

            success: true,

            message: "Payment Successful",

            payment,

        });

    } catch (error) {

        console.log(error);
         console.error("VERIFY PAYMENT ERROR");
        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

export const getPaymentdetails = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        return res.status(200).json({
            success: true,
            payment,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};