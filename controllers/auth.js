require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@gmail.com",
    // hashedPassword: "password",
    password: "password",
    isAdmin: true,
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  },
  {
    id: 2,
    username: "John Doe",
    email: "test@gmail.com",
    // hashedPassword: "password",
    password: "password",
    isAdmin: false,
    address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  },
];

const register = async (req, res) => {
  try {
    const { id, username, email, password, address } = req.body;

    const checkEmailUser = users.find((user) => user.email === email);

    if (checkEmailUser)
      return res.status(400).json({ message: "Email is already in use" });

    const checkAddressUser = users.find((user) => user.address == address);

    if (checkAddressUser)
      return res
        .status(400)
        .json({ message: "Metamask account already in use" });

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    // const user = { id, username, email, hashedPassword, address, isAdmin: false };
    const user = { id, username, email, password, address, isAdmin: false };

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
    const { email, password: pwd, address } = req.body;

    const checkUser = users.find((user) => user.email === email);

    if (!checkUser)
      return res.status(400).json({ message: "User does not exist" });

    if (checkUser.address !== address)
      return res
        .status(400)
        .json({ message: "Use the metamask account linked with the email" });

    // const validPassword = bcrypt.compareSync(pwd, checkUser.hashedPassword);

    // if (!validPassword)
    //   return rs.status(400).json({ message: "Invalid password" });

    // const { hashedPassword, ...userWithoutPassword } = checkUser;
    const { password, ...userWithoutPassword } = checkUser;

    const token = jwt.sign(
      { ...userWithoutPassword },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: 900, // 15 min
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
