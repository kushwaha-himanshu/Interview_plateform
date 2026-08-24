import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  adminAuth,
} from "../config/firebase_admin.js";
// import sendEmail from "../services/email.services.js";
//  import Otp from "../models/otp.model.js";
//  import transporter from "../services/email.services.js";


const generateAccessAndRefreshToken=async (userId)=>{
try {
  
  const user=await User.findById(userId);
  //small check for userr
  const accessToken=user.generateAccessToken()
  const refreshToken=user.generateRefreshToken()
  user.refreshToken=refreshToken
  await user.save({validateBeforeSave:false})
  return {accessToken,refreshToken}
  
} catch (error) {
  console.error("Error generating tokens:",error);
  throw new Error("Error generating tokens");
}
}
export const  register = async (req, res) => {
const {fullname,email,password}=req.body;
if(!fullname||!email||!password){
    return res.status(400).json({message:"All fields are required"});
 
}
const existingUser=await User.findOne({
  email:email
})
if(existingUser){
  throw new Error("User with this email already exists");
}
//create user
try{
  
  const user=await User.create({
    fullname,
    email,
    password
  })
//generate tokens
  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
//   //send welcome email
//   const subject = "🌍 Welcome to TravelBridge – Your Journey Starts Here!";
// const text=`Hi ${user.fullname}, welcome to TravelBridge!`;
// const html = `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// </head>
// <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

// <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;padding:40px 0;">
// <tr>
// <td align="center">

// <table width="600" cellpadding="0" cellspacing="0" border="0"
// style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

//   <!-- Header -->
//   <tr>
//     <td align="center"
//       style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:40px 20px;">
//       <h1 style="margin:0;color:#ffffff;font-size:32px;">
//         ✈️ TravelBridge
//       </h1>
//       <p style="margin:10px 0 0;color:#dbeafe;font-size:16px;">
//         Connecting Travelers Around the World
//       </p>
//     </td>
//   </tr>

//   <!-- Content -->
//   <tr>
//     <td style="padding:40px 35px;color:#334155;">

//       <h2 style="margin-top:0;color:#1e293b;">
//         Welcome, ${user.fullname}! 🎉
//       </h2>

//       <p style="font-size:16px;line-height:1.7;">
//         We're thrilled to have you join the <strong>TravelBridge</strong> community.
//         Your account has been successfully created and you're now ready to discover
//         exciting destinations, connect with fellow travelers, and plan unforgettable journeys.
//       </p>

//       <!-- Info Box -->
//       <div style="
//         background:#eff6ff;
//         border-left:4px solid #2563eb;
//         padding:18px;
//         border-radius:8px;
//         margin:25px 0;">
//         <h3 style="margin-top:0;color:#1d4ed8;">
//           🚀 Get Started
//         </h3>
//         <ul style="padding-left:20px;line-height:1.8;margin-bottom:0;">
//           <li>Complete your profile</li>
//           <li>Explore destinations and travel opportunities</li>
//           <li>Connect with travelers worldwide</li>
//           <li>Receive personalized travel recommendations</li>
//         </ul>
//       </div>

//       <!-- CTA Button -->
//       <div style="text-align:center;margin:35px 0;">
//         <a href="https://yourdomain.com"
//           style="
//             background:#2563eb;
//             color:#ffffff;
//             text-decoration:none;
//             padding:14px 28px;
//             border-radius:8px;
//             font-size:16px;
//             font-weight:bold;
//             display:inline-block;">
//           Explore TravelBridge
//         </a>
//       </div>

//       <p style="font-size:15px;line-height:1.7;">
//         If you have any questions or need assistance, our support team is always here to help.
//       </p>

//       <p style="font-size:15px;line-height:1.7;">
//         Thank you for choosing TravelBridge. We look forward to being part of your travel adventures.
//       </p>

//       <p style="margin-top:30px;">
//         Safe Travels,<br>
//         <strong>The TravelBridge Team</strong>
//       </p>

//     </td>
//   </tr>

//   <!-- Footer -->
//   <tr>
//     <td align="center"
//       style="background:#f8fafc;padding:25px;color:#64748b;font-size:13px;">
//       © ${new Date().getFullYear()} TravelBridge. All rights reserved.
//       <br><br>
//       Made with ❤️ for travelers worldwide.
//     </td>
//   </tr>

// </table>

// </td>
// </tr>
// </table>

// </body>
// </html>
// `;
//   const emailSent = await sendEmail(user.email,subject,text,html);
//   if(!emailSent){
//     console.error("Failed to send welcome email to",user.email);
//   }

  //set cookies
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("accessToken",accessToken,{httpOnly:true,secure:isProduction,sameSite:"lax"});
  res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:isProduction,sameSite:"lax"});
  return res.status(200).json({
    message:"User registered successfully",
    user:{
      id:user._id,
      fullname:user.fullname,
      email:user.email,
      accessToken,
      refreshToken
    }
  });


}catch(err){
  console.error("Error creating user:",err);
  throw new Error("Error creating user");
}

}




export const login =async (req , res) =>{

  try {

    const {email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required");}

    const user= await User.findOne({
      email:email
    })

    if(!user){
      return res.status(404).json({message:"Invalid Credential"})
    }
    const isValidPassword= await user.isPasswordCorrect(password);

    if(!isValidPassword){
       return res.status(400).json({message:"invalid Credential"})
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    const userData=await User.findById(user._id).select("-password -refreshToken");
    if(!userData){
      return res.status(404).json({message:"User not found"})
    }
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken",accessToken,{httpOnly:true,secure:isProduction,sameSite:"lax"});
    res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:isProduction,sameSite:"lax"});

return res.status(200).json({
  message:"Login successful",
  user:userData,
  accessToken,
  refreshToken
})
   
    
    
  }catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
}

export const googleAuth = async (req, res) => {
  try {

    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token is required",
      });
    }

    // Verify Firebase token here
    const decodedToken =
      await adminAuth.verifyIdToken(
        idToken);

    const {
      uid,
      email,
      name,
      picture,
    } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google email not available",
      });
    }

    let user = await User.findOne({
      email,
    });

    if (!user) {

      user = await User.create({
        fullname: name || "Google User",
        email,
        googleId: uid,
        authProvider: "google",
        avatar: picture,
      });

    }

    const {
      accessToken,
      refreshToken,
    } = await generateAccessAndRefreshToken(
      user._id
    );
 const isProduction = process.env.NODE_ENV === "production";
    res
      .cookie(
        "accessToken",
        accessToken,
        {
          httpOnly: true,
          secure:isProduction,
          sameSite: "lax",
        }
      )
      .cookie(
        "refreshToken",
        refreshToken,
        {
          httpOnly: true,
          secure:isProduction,
          sameSite: "lax",
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Google Authentication successful",

      user: {
        id: user._id,
        fullname: user.fullname,
        authProvider:
          user.authProvider,
        email: user.email,
      },
    });

  } catch (err) {

    console.error(
      "Google Authentication error:",
      err
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid Google authentication",
    });
  }
};
 
export const logout=async(req,res)=>{
  try{
   const user=await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:"",
      }
    },
    {new:true}
  )
  console.log("User logged out successfully", user);
  const isProduction = process.env.NODE_ENV === "production";
res.clearCookie("accessToken",{httpOnly:true,secure:isProduction,sameSite:"lax"});
res.clearCookie("refreshToken",{httpOnly:true,secure:isProduction,sameSite:"lax"});
return res.status(200).json({message:"Logout successful"});
  }catch(err){
    console.error("Logout error:",err);
    return res.status(500).json({message:"Server error during logout"});
  }
}

// export const forgotPassword=async(req,res)=>{
//   try {
//      console.log("BODY =", req.body);

//   const  {email}  = req.body;
//     const user=await User.findOne({email:email});
//     if(!user){
//       return res.json({
//       message:
//         "If an account exists, OTP has been sent."
//     });
//     } 

//   const otp=Math.floor(100000+Math.random()*900000).toString();
//   await Otp.deleteMany({ email });
//   await Otp.create({
//   email,
//   otp,
//   expiresAt: new Date(
//     Date.now() + 10 * 60 * 1000
//   )
// });
//  await sendEmail(
//   email,
//   "Password Reset OTP",
//   `Your OTP is ${otp}`,
//   `
//     <h2>Your OTP is</h2>
//     <h1>${otp}</h1>
//     <p>Valid for 10 minutes</p>
//   `
// );
//   }
//   catch (error) {
//     console.error("Forgot Password error:",error);
//     return res.status(500).json({message:"Server error during forgot password"});
//   }
//   res.json({
//   success: true
//   });
// }

// export const verifyOtp=async(req,res)=>{
//   try {
//     const {email,otp}=req.body;
//     const record=await Otp.findOne({email,otp});
//     if(!record){
//       return res.status(400).json({message:"OTP not found"});
//     } 
//     if(record.expiresAt<new Date()){
//       await Otp.deleteOne({email,otp});
//       return res.status(400).json({message:"OTP expired"});
//     }
//     if (otp!==record.otp){
//       return res.status(400).json({message:"Invalid OTP"});
//     }
//   } catch (error) {
//     console.error("Verify OTP error:",error);
//     return res.status(500).json({message:"Server error during OTP verification"});
//   }
//   res.json({
//     success:true
//   })
// }

// export const resetPassword=async(req,res)=>{
//   try {
//     const {email,newPassword}=req.body;
//     const user=await User.findOne({email:email});
//     if(!user){
//       return res.status(404).json({message:"User not found"});
//     } 
//     user.password=newPassword;
//     await user.save();
//     await Otp.deleteMany({email:email});
//    await sendEmail( 
//   email,
//   "Password Reset Successful",
//   "Your password has been reset successfully.",
//   `
//     <h2>Password Reset Successful</h2>
//     <p>Your password has been reset successfully. If you did not initiate this change, please contact our support immediately.</p>
//   `
// );
//   } catch (error) {
//     console.error("Reset Password error:",error);
//     return res.status(500).json({message:"Server error during password reset"});
//   }
// }


// export const getPremiumStatus = async(req,res)=>{
//   console.log("getPremiumStatus")

//     try{

//         const user = await User.findById(req.user._id)
//             .select("premium premiumPlan premiumExpiry");

//         res.status(200).json(user);
//     }catch(err){

//         res.status(500).json({
//             success:false,
//             message:err.message
//         });

//     }

// }



