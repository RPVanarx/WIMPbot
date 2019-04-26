module.exports = {
  PORT: process.env.WEB_PORT || 3003,

  TOKEN_KEY: process.env.WEB_TOKEN_KEY,
  AUTH_AGE: process.env.WEB_AUTH_AGE || 1000 * 60 * 60, // 60 min by default

  SHA_256_HASH_LENGTH: 64,

  PHOTO_FILE_SIZE_MAX: 10 * 1024 * 1024, // 10 MiB (10 MB is telegram API limit)
  PHOTO_FILE_SIZE_MIN: 1024, // 1 KiB

  JSON_ERROR_NAME: 'error',

  CORS: {
    ORIGIN: '*',
    ALLOW_METHODS: 'GET,POST,OPTIONS',
    MAX_AGE: 86400, // 1 day
  },

  PREFIX: {
    API_V1: '/api/v1',
    PHOTO: '/photo',
    REQUESTS: '/requests',
    LIST: '/list',
    REQUEST: '/request',
    SIGNIN: '/signin',
    SIGNUP: '/signup',
  },
};
