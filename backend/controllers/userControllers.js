const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const nodemailer = require("nodemailer")
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const forgotPassword = asyncHandler(async (req,res)=> {
  console.log('here')
  const user = await User.findOne({email: req.body.email})
  if(!user) {
    res.status(404);
    throw new Error("the Email does not exist")
  } else {
    const resetCode = crypto.randomBytes(8).toString('hex');
    console.log(resetCode)
    let transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.EMAIL_ADDRESS, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });
    try {
    let info = await transporter.sendMail({
      from: "vivekrawat8126@gmail.com", // sender address
      to: user.email, // list of receivers
      subject: "Password Reset", // Subject line
      text: `the following is your password reset token you requested ${resetCode}`, // plain text body
    });
    await User.findByIdAndUpdate(user._id,{passwordResetToken: resetCode, resetTokenDate: new Date()})
    console.log(info)
    res.send({email: user.email,_id: user.id, info})
  } catch(error) {
    res.status(403).send(error)
  }
  }
})

const resetCode = asyncHandler(async(req,res) => {
  const user = await User.findOne({_id: req.body._id})
  console.log(user)
  let time  = new Date()
  let timeDifference = (time - user.resetTokenDate)/(1000*60)

  if (req.body.code === user.passwordResetToken) {
    if (timeDifference < 10) {
      res.status(200).json({message: 'success'})
    } else {
      res.status(401).json({message: 'this token code has expired please request again'})
    }
  } else {
    res.status(401).json({message: 'the code entered is invalid'})
  }
})

const updatePassword = asyncHandler(async(req,res)=> {
  try {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  await User.findByIdAndUpdate(req.body._id,{password: password})
  res.status(200).json({message: "success"})
  } catch(err) {
    res.status(401).json(err)
  }
})

module.exports = { allUsers, registerUser, authUser, forgotPassword, resetCode, updatePassword };
