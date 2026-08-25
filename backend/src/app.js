import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment_route.js"
import resumeRoutes from "./routes/resume.routes.js";
import interviewRoutes
  from "./routes/interview.routes.js";
import coachRoutes from "./routes/coach.routes.js";

import subscriptionRoutes from "./routes/subscription.routes.js";
const allowedOrigins = [
    "http://localhost:5173",
    "https://interview-plateform-three.vercel.app"
];

const app = express();

app.use(
    cors({
        origin: function(origin, callback){
            if(!origin || allowedOrigins.includes(origin)){
                callback(null,true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials:true
    })
);
//common middleware for acceptiong json formate file
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
// for parsing  cookies 
app.use(cookieParser());
// routes import
app.use("/api/auth", userRoutes)
app.use("/api/payment",paymentRoutes);
app.use("/api/resume", resumeRoutes);
app.use(
  "/api/interview",
  interviewRoutes
);
app.use("/api/coach", coachRoutes);
app.use("/api/subscription", subscriptionRoutes);
export {app}