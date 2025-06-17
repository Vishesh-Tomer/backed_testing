const Redis = require('ioredis');
const config = require('../config/config');
const logger = require('../config/logger');

const redis = new Redis(config.redis.url);

redis.on('connect', () => logger.info('Connected to Redis'));
redis.on('error', (err) => logger.error('Redis Error:', err));

module.exports = redis;