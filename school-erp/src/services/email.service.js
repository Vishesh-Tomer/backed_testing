const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const ejs = require('ejs');
const path = require('path');

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset Password - School ERP';
  const resetPasswordUrl = `http://localhost:${config.port}/reset-password?token=${token}`;
  const html = await ejs.renderFile(path.join(__dirname, '../templates/resetPassword.ejs'), { user: to, resetPasswordUrl });
  await sendEmail(to, subject, html);
};

const sendNewAdminEmail = async (to, password, name) => {
  const subject = 'Welcome to School ERP - Admin Account Created';
  const html = await ejs.renderFile(path.join(__dirname, '../templates/newAdmin.ejs'), { email: to, password, name });
  await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendNewAdminEmail,
};