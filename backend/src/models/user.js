import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },  
   password: {
  type: String,
  required: function () {
    return this.authProvider === "local";
  }
},
googleId: {
  type: String,
  sparse: true,
},

authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local"
},
  refreshToken: {
    type: String,
  }
}, { timestamps: true });   

//encrypt password
userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10);
});

//bcrypt
userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}

//access token
userSchema.methods.generateAccessToken=function(){
    //short lived access token
return jwt.sign({
    _id:this._id,
    email:this.email,
    fullname:this.fullname

},
process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
);

}

//refresh token
userSchema.methods.generateRefreshToken=function(){
    //large lived refresh token
return jwt.sign({
    _id:this._id,
   

},
process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
);

}
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;