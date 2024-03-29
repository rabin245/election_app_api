const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const validateUser = require("../utils/validator");
const _ = require("lodash");
const { generateOTP } = require("../utils/otp");
const { sendMail } = require("../utils/verificationMail");

const register = async (req, res) => {
  const userInfo = _.pick(req.body, [
    "username",
    "email",
    "password",
    "address",
  ]);
  try {
    const { error } = validateUser(userInfo);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: userInfo.email });
    if (user)
      return res.status(400).send({ message: "Email already registered." });

    user = await User.findOne({ address: userInfo.address });
    if (user)
      return res
        .status(400)
        .send({ message: "Metamask account already registered." });

    user = new User({
      ...userInfo,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
      await user.save();
    } catch (err) {
      return res.status(400).send(err.message);
    }

    return res.status(200).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Invalid email or password." });

    if (user.address !== req.body.address)
      return res.status(400).send({
        message: "Use the metamask account linked with the email",
      });

    const otp = generateOTP();
    user.otp = otp;

    await user.save();

    sendMail({ to: user.email, otp: otp });

    const token = user.generateAuthToken();

    res.cookie("auth_token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return res.status(200).json({
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const verify = async (req, res) => {
  const { email, otp, address } = req.body;

  try {
    if (!req.cookies.auth_token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "invalid email" });

    if (user.address !== address)
      return res.status(400).send({
        message: "Use the metamask account linked with the email",
      });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid otp" });

    user.otp = null;
    await user.save();

    const userWithoutPassword = _.pick(user, [
      "_id",
      "username",
      "email",
      "address",
      "isAdmin",
    ]);

    return res.status(200).json({
      message: "User verified successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const logout = async (req, res) => {
  try {
    res
      .clearCookie("auth_token", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  verify,
};
