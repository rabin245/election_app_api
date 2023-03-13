const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      username: this.username,
      email: this.email,
      address: this.address,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: 15 * 60, // 15 min
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const userJoiSchema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(3).max(255).required().email(),
  password: Joi.string().required(),
  isAdmin: Joi.boolean(),
  address: Joi.string().required(),
});

module.exports = { User, userJoiSchema };
