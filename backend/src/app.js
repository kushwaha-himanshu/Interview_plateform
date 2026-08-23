import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express();
app.use(
    cors({
        origin:process.env.CORS_ORIGIN||'*',
        credentials:true
    })
)
//common middleware for acceptiong json formate file
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
// for parsing  cookies 
app.use(cookieParser());
// routes import



export {app}