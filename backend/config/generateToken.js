const jwt  = require("jsonwebtoken");



const generateToken = async (id)=>{
    const userId = id.toString();
    secretCode=process.env.JWT_SECRET_CODE;
    const token =await jwt.sign({userId},secretCode,{expiresIn:"15d"});
    return token;
}
module.exports = generateToken;