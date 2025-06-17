const s3 = require('../lib/aws_S3');
const CONSTANT = require('../config/constant');

const uploadImage = async (req, path) => {
  const upload = await s3.uploadProfile(req, path);
  return upload;
};

module.exports = {
  uploadImage,
};