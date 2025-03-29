const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send OTP email for verification
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - One-time password
 * @returns {Promise}
 */
const sendOtpEmail = async (to, name, otp) => {
  const mailOptions = {
    from: `"AgriPlant" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4CAF50;">AgriPlant</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h2>Hello ${name},</h2>
          <p>Thank you for registering with AgriPlant. Please use the following OTP to verify your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 10px; padding: 10px; background-color: #eee; border-radius: 5px;">${otp}</div>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} AgriPlant. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - One-time password
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (to, name, otp) => {
  const mailOptions = {
    from: `"AgriPlant" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4CAF50;">AgriPlant</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h2>Hello ${name},</h2>
          <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 10px; padding: 10px; background-color: #eee; border-radius: 5px;">${otp}</div>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} AgriPlant. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send order confirmation email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {Object} order - Order details
 * @returns {Promise}
 */
const sendOrderConfirmationEmail = async (to, name, order) => {
  const mailOptions = {
    from: `"AgriPlant" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Order Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4CAF50;">AgriPlant</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h2>Hello ${name},</h2>
          <p>Thank you for your order! Your order #${
            order._id
          } has been confirmed and is being processed.</p>
          <div style="margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ৳${order.totalPrice}</p>
            <p><strong>Estimated Delivery:</strong> ${new Date(
              order.estimatedDelivery
            ).toLocaleDateString()}</p>
          </div>
          <p>You can track your order status through the app.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} AgriPlant. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
};
