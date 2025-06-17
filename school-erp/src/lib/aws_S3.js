const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const s3Client = new S3Client({ region: config.aws.s3.region });

const uploadProfile = async (file, path) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (!allowedTypes.includes(file.mimetype)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only JPEG and PNG images are allowed');
  }
  if (file.size > maxSize) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File size must be less than 5MB');
  }

  const compressedBuffer = await sharp(file.buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const key = `${path}/${Date.now()}_${file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: config.aws.s3.bucket,
    Key: key,
    ContentType: 'image/jpeg',
    Body: compressedBuffer,
  });

  try {
    await s3Client.send(command);
    const url = `https://${config.aws.s3.bucket}.s3.${config.aws.s3.region}.amazonaws.com/${key}`;
    return { previewUrl: url, data: { Location: url } };
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `S3 Upload Error: ${err.message}`);
  }
};

module.exports = {
  uploadProfile,
};