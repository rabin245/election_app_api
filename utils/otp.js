const otpGenerator = require("otp-generator");

const otpConfig = {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
};

module.exports.generateOTP = () => otpGenerator.generate(6, otpConfig);
