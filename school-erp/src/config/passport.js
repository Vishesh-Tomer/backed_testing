const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { AdminModel } = require('../models/admin.model');
const redis = require('../lib/redis');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (!payload.type || payload.type !== tokenTypes.ACCESS) {
      return done(new Error('Invalid or missing token type'), false);
    }
    const cachedAdmin = await redis.get(`admin:${payload.sub}`);
    let admin;
    if (cachedAdmin) {
      admin = JSON.parse(cachedAdmin);
    } else {
      admin = await AdminModel.findById(payload.sub).select('-password');
      if (admin) {
        await redis.set(`admin:${payload.sub}`, JSON.stringify(admin), 'EX', 3600); // Cache for 1 hour
      }
    }
    if (!admin || admin.isDeleted) {
      return done(null, false);
    }
    done(null, admin);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};