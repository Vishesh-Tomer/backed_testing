const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset Password - School ERP';
  const resetPasswordUrl = `http://localhost:${config.port}/reset-password?token=${token}`;
  const text = `Dear user,\n\nTo reset your password, click on this link: ${resetPasswordUrl}\nIf you did not request a password reset, please ignore this email.\n\nRegards,\nSchool ERP Team`;
  await sendEmail(to, subject, text);
};

const sendNewAdminEmail = async (to, password, name) => {
  const subject = 'Welcome to School ERP - Admin Account Created';
  const text = `Dear ${name},\n\nYour admin account has been created successfully.\n\nEmail: ${to}\nPassword: ${password}\n\nPlease log in and change your password immediately.\n\nRegards,\nSchool ERP Team`;
  await sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendNewAdminEmail,
};