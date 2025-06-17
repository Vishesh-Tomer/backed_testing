const zxcvbn = require('zxcvbn');

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('Password must be at least 8 characters');
  }
  const result = zxcvbn(value);
  if (result.score < 3) {
    return helpers.message('Password is too weak. Use a stronger password.');
  }
  return value;
};

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid MongoDB ObjectId');
  }
  return value;
};

module.exports = {
  password,
  objectId,
};