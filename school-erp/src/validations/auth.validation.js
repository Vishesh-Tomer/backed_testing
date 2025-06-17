const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required(),
    schoolId: Joi.string().custom(objectId).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    twoFactorCode: Joi.string().allow(''),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const createAdmin = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    address: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    zipcode: Joi.string(),
    profilePhoto: Joi.string(),
    schoolId: Joi.string().custom(objectId).required(),
  }),
};

const getAdmins = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    searchBy: Joi.string().allow('').allow(null),
    status: Joi.number().allow('').allow(null),
  }),
};

const getAdmin = {
  params: Joi.object().keys({
    adminId: Joi.string().custom(objectId),
  }),
};

const updateAdmin = {
  params: Joi.object().keys({
    adminId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      phone: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password).allow('').allow(null),
      address: Joi.string().allow('').allow(null),
      state: Joi.string().allow('').allow(null),
      country: Joi.string().allow('').allow(null),
      city: Joi.string().allow('').allow(null),
      zipcode: Joi.string().allow('').allow(null),
      profilePhoto: Joi.string().allow('').allow(null),
      status: Joi.number(),
    })
    .min(1),
};

const deleteAdmin = {
  params: Joi.object().keys({
    adminId: Joi.string().custom(objectId),
  }),
};

const verify2FA = {
  body: Joi.object().keys({
    code: Joi.string().required().length(6),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  verify2FA,
};