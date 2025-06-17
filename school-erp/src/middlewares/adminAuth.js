const httpStatus = require('http-status');
const passport = require('passport');
const ApiError = require('../utils/ApiError');
const CONSTANT = require('../config/constant');
const { getRoleRights } = require('../config/roles');
const { Token } = require('../models');

const adminAuth = (...requiredRights) => async (req, res, next) => {
  // IP Whitelisting (example: allow only specific IPs in production)
  if (process.env.NODE_ENV === 'production') {
    const allowedIps = ['127.0.0.1', '::1']; // Add your allowed IPs
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!allowedIps.includes(clientIp)) {
      return res.status(CONSTANT.FORBIDDEN).send({ code: CONSTANT.FORBIDDEN, message: 'IP not allowed' });
    }
  }

  passport.authenticate('jwt', { session: false }, async (err, admin, info) => {
    if (err || info || !admin) {
      return res.status(CONSTANT.UNAUTHORIZED).send({ code: CONSTANT.UNAUTHORIZED, message: CONSTANT.NO_TOKEN });
    }

    // Check if token is blacklisted
    const token = req.headers.authorization?.split(' ')[1];
    const tokenDoc = await Token.findOne({ token, user: admin._id, blacklisted: false });
    if (!tokenDoc) {
      return res.status(CONSTANT.UNAUTHORIZED).send({ code: CONSTANT.UNAUTHORIZED, message: 'Invalid Token!' });
    }

    req.user = admin;

    if (requiredRights.length) {
      const userRights = await getRoleRights(admin.role);
      const hasRequiredRights = requiredRights.every((right) => userRights.includes(right));
      if (!hasRequiredRights && req.params.adminId !== admin.id) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    next();
  })(req, res, next);
};

module.exports = adminAuth;