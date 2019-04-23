module.exports = {
  WEB_AUTH_AGE: process.env.WEB_AUTH_AGE || 1000 * 60 * 60, // 60 min by default
  WEB_PORT: process.env.WEB_PORT || 3003,

  WEB_TOKEN_KEY: process.env.WEB_TOKEN_KEY,
  WEB_PHOTO_FILE_SIZE_MAX: 10 * 1024 * 1024, // 10 MiB (10 MB is telegram API limit)
  WEB_PHOTO_FILE_SIZE_MIN: 1024, // 1 KiB
  WEB_POST_FIELD_LENGTH_MAX: 1024,

  WEB_API_JSON_ERROR_NAME: 'error',

  WEB_API_V1_PREFIX: '/api/v1',
  WEB_API_PATH_PHOTO: '/photo',
  WEB_API_PATH_REQUESTS: '/requests',
  WEB_API_PATH_LIST: '/list',
  WEB_API_PATH_REQUEST: '/request',
  WEB_API_PATH_SIGNIN: '/signin',
  WEB_API_PATH_SIGNUP: '/signup',
};
