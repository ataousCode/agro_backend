/**
 * Generate a random OTP
 * @param {number} length - Length of the OTP
 * @returns {string} OTP
 */
const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let OTP = "";

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

/**
 * Create OTP data with expiry time
 * @param {number} expiryMinutes - Minutes until OTP expires
 * @returns {Object} OTP data with code and expiry
 */
const createOTPData = (expiryMinutes = 10) => {
  const code = generateOTP();
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);

  return { code, expiry };
};

/**
 * Check if OTP is expired
 * @param {Date} expiryDate - OTP expiry date
 * @returns {boolean} Is OTP expired
 */
const isOTPExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

module.exports = {
  generateOTP,
  createOTPData,
  isOTPExpired,
};
