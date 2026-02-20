const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    const token = await req.cookies.token;

     

    if (!token || typeof token !== 'string' || token == undefined || token == "") {
      return res.status(400).json({ msg: "Invalid token" });
    }
    let user = await jwt.verify(token, process.env.JWT_SECRET_CODE);

    if (!user) {
      return res.status(400).json({ msg: "not any verify token" });
    }
    req.userId = user.userId;
    next();
  } catch (error) {
    console.log("isAuth Middlewere error");
    console.log(error);
    return res.status(500).json({ msg: "isAuth error" ,token});
  }
};
module.exports = isAuth;
