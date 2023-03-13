const Joi = require("joi");
const { userJoiSchema: schema } = require("../models/users");

const validateUser = (user) => schema.validate(user);

module.exports = validateUser;
