const generateToken = require("../config/generateToken");
const sendEmail = require("../config/nodemailer");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password } =
      await req.body;

    if (!firstName ||!email ||!userName ||!password) {
      return res.status(400).json({
        message: "plese fill all the informations",
      });
    }
     if (userName.length < 4) {
      return res.status(400).json({
        message: "User Name length should be 4 cherecter",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password length should be 8 cherecter",
      });
    }

    let isUserExistEmail = await User.findOne({ email });

    if (isUserExistEmail) {
      return res.status(400).json({
        message: "user email is alradey Exist plese Login !",
      });
    }
    let isUserExistuserName = await User.findOne({ userName });

    if (isUserExistuserName) {
      return res.status(400).json({
        message: "UserName is alradey Exist plese try another UserName !",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword
    });

    const token = generateToken(createUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 3600 * 1000,
      secure: process.env.MODE !== "devlopment"
    });

    return res.status(201).json(createUser)
  } catch (error) {

    console.log("signup error");
    console.log(error);

    return res.status(500).json({
      message: "signup error",
    });
  }
};

const login = async (req, res) => {
  try {
const {input,password,isEmail} =req.body

    if (!password) {
      return res.status(400).json({ message: "Enter Password!" });
    }
let realUser;
    if(isEmail){
       realUser = await User.findOne({ email:input });
    }else{
       realUser = await User.findOne({ userName:input });

    }


    // if (req.body.email) {
    //   var { email, password } = await req.body;
    //   var realUser = await User.findOne({ email });
    // } else if (req.body.userName) {
    //   var { userName, password } = await req.body;
    //   var realUser = await User.findOne({ userName });
    // } else {
    //   return res.status(400).json({ message: "Enter email or userName!" });
    // }

    if (!realUser) {
      return res
        .status(400)
        .json({ message: "User does not exist! plese signup " });
    }

    let iscurrectPassword = await bcrypt.compare(password, realUser.password);

    if (!iscurrectPassword) {
      return res.status(400).json({ message: "password incurrect" });
    }

    const token = await generateToken(realUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 3600 * 1000,
      secure: process.env.MODE !== "devlopment",
    });

    return res.status(200).json(realUser);
  } catch (error) {
    console.log("login error");
    console.log(error);

    return res.status(500).json({
      message: "login error",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "user succesfully logout",
  });
};

const isUseNameExists = async (req, res) => {
  try {
  const {userName} = req.body;
  if (!userName) {
    return
  }
  let user = await User.findOne({userName});
  

  const exist = user?true:false;
  return res.status(200).json({exist})
    
  } catch (error) {
    console.log("isUseNameExists error \n",error);

    return res.status(500).json({
      message: "isUseNameExists error",
    });
  }
};

const googleAuth = async (req, res) => {
 try {
  const {name, email,profileImage} = req.body;
  
  if (!name || !email) {
    return res.status(400).json({message: "Name and Email Required",});
  }

  let user = await User.findOne({email});

  if (user) {
    if (!user.profileImage && profileImage) {
      user.profileImage = profileImage;
      await user.save();
    }
  } else {
    user = await User.create({
      firstName:name,
      email,
      profileImage
    })

  }

  const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 3600 * 1000,
      secure: process.env.MODE !== "devlopment"
    });

    return res.status(200).json(user);

 } catch (error) {
  console.log("googleAuth error \n",error);

    return res.status(500).json({
      message: "googleAuth error",
    });
 }
};

const setUseName = async (req, res) => {
  try {
  const {userName,userId} = req.body;
  if (!userName) {
    return res.status(400).json({
        message: "UserName Required",
      });
  }
   if (userName.length < 4) {
      return res.status(400).json({
        message: "UserName length should be 4 cherecter",
      });
    }
  const isUserExist = await User.findOne({userName});

  if (isUserExist) {
  return res.status(400).json({message:'userName Already Exist'})  
  }

  const user = await User.findByIdAndUpdate(userId,{userName},{new:true});

  return res.status(200).json(user);
    
  } catch (error) {
    console.log("setUseName error \n",error);

    return res.status(500).json({
      message: "setUseName error",
    });
  }
};

// Rest password Controllers
const sendOtp = async (req, res) => {
  try {

  const {input,isEmail} = req.body;
  if (!input) {
    return res.status(400).json({
      message: "Email OR UserName is Required",
    });
  }
  let user;
  if (isEmail) {
   user = await User.findOne({email:input});
  } else {
   user = await User.findOne({userName:input});
  }

  if (!user) {
  return res.status(400).json({message:'User does not Exist'})  
  }

  const otp = Math.floor(Math.random()*8000+2000).toString();
  console.log(otp);
  
  const mailerRes = await sendEmail(user.email,otp);
  console.log(mailerRes);
  
  console.log(otp);
  

  user.resetPassword.otp = otp;
  user.resetPassword.otpExpiredTime = Date.now() + 90*1000;
  user.resetPassword.isVarified = false;

  await user.save();

  return res.status(200).json({message:'OTP send sucessfully'});
    
  } catch (error) {
    console.log("sendOtp error \n",error);

    return res.status(500).json({
      message: "sendOtp error",
    });
  }
};
const otpVerification = async (req, res) => {
  try {

  const {input, isEmail, otp} = req.body;
  if (!otp) {
    return res.status(400).json({
      message: "OTP is Required",
    });
  }
  let user;
  if (isEmail) {
   user = await User.findOne({email:input});
  } else {
   user = await User.findOne({userName:input});
  }

  if (!user) {
  return res.status(400).json({message:'user does not Exist'})  
  }

  if (user.resetPassword.otpExpiredTime < Date.now()) {
  return res.status(400).json({message:'Expired OTP Time'})  
  }

  if (otp !== user.resetPassword.otp) {
  return res.status(400).json({message:'Incurrect OTP'})  
  }

  user.resetPassword.otp = undefined;
  user.resetPassword.otpExpiredTime = undefined;
    user.resetPassword.isVarified = true;

  await user.save();

  return res.status(200).json({message:'OTP Verification sucessfully'});
    
  } catch (error) {
    console.log("otpVerification error \n",error);

    return res.status(500).json({
      message: "otpVerification error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
  const {input, isEmail, password} = req.body;
  if (!password) {
    return res.status(400).json({
      message: "New Password is Required",
    });
  }
  if (password.length < 8) {
      return res.status(400).json({
        message: "Password length should be 8 cherecter",
      });
    }

  let user;
  if (isEmail) {
   user = await User.findOne({email:input});
  } else {
   user = await User.findOne({userName:input});
  }

  if (!user) {
  return res.status(400).json({message:'user does not Exist'})  
  }
  if (!user.resetPassword.isVarified) {
  return res.status(400).json({message:'user is not verified'})  
  }
  
  const isSamePassword = await bcrypt.compare(password,user.password);
if (isSamePassword) {
  return res.status(400).json({message:'Do not Enter preveus password Enter different one'});
}

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPassword.isVarified = false;

  await user.save();

  const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 3600 * 1000,
      secure: process.env.MODE !== "devlopment",
    });

  return res.status(200).json(user);
    
  } catch (error) {
    console.log("resetPassword error \n",error);

    return res.status(500).json({
      message: "resetPassword error",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  isUseNameExists,
  googleAuth,
  setUseName,
  sendOtp,
  otpVerification,
  resetPassword
};
