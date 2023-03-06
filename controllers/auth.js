require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = [
  {
    id: 1,
    username: "John Doe",
    email: "test@gmail.com",
    hashedPassword: "password",
  },
];

const register = async (req, res) => {
  try {
    const { id, username, email, password } = req.body;

    const checkUser = users.find((user) => user.email === email);

    if (checkUser)
      return res.status(400).json({ message: "Email is already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = { id, username, email, hashedPassword };

    users.push(user);

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
    const { email, password: pwd } = req.body;

    const checkUser = users.find((user) => user.email === email);

    if (!checkUser)
      return res.status(400).json({ message: "User does not exist" });

    const validPassword = bcrypt.compareSync(pwd, checkUser.hashedPassword);

    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const { hashedPassword, ...userWithoutPassword } = checkUser;

    const token = jwt.sign(
      { ...userWithoutPassword },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.cookie("auth_token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return res.status(200).json({
      ...userWithoutPassword,
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
};
