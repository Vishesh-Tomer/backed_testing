const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load .env file with error handling
const envFilePath = path.resolve(__dirname, '../../.env');
const dotenvResult = dotenv.config({ path: envFilePath });
if (dotenvResult.error) {
  throw new Error(`Failed to load .env file: ${dotenvResult.error.message}`);
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('MongoDB connection URL'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('Minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('Days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().required().description('Server that will send the emails'),
    SMTP_PORT: Joi.number().required().description('Port to connect to the email server'),
    SMTP_USERNAME: Joi.string().required().description('Username for email server'),
    SMTP_PASSWORD: Joi.string().required().description('Password for email server'),
    EMAIL_FROM: Joi.string().required().description('The from field in the emails sent by the app'),
    S3_BUCKET: Joi.string().required().description('AWS S3 bucket name'),
    ACCESS_KEY: Joi.string().required().description('AWS access key'),
    SECRET_KEY: Joi.string().required().description('AWS secret key'),
    S3_REGION: Joi.string().required().description('AWS region'),
    REDIS_URL: Joi.string().required().description('Redis connection URL'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {}, // Removed deprecated options
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  aws: {
    s3: {
      bucket: envVars.S3_BUCKET,
      accessKey: envVars.ACCESS_KEY,
      secretKey: envVars.SECRET_KEY,
      region: envVars.S3_REGION,
    },
  },
  redis: {
    url: envVars.REDIS_URL,
  },
};