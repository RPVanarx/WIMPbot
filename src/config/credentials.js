require('dotenv').config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TOKEN,
  VIBER_TOKEN: process.env.VIBER_TOKEN,
  VIBER_WEBHOOK_PORT: process.env.VIBER_WEBHOOK_PORT,
  VIBER_WEBHOOK_URL: process.env.VIBER_WEBHOOK_URL,
  DB: {
    USER: process.env.PGUSER,
    HOST: process.env.PGHOST,
    DATABASE: process.env.PGDATABASE,
    PASSWORD: process.env.PGPASSWORD,
    PORT: process.env.PGPORT || 3000,
    POOL_MIN: 0,
    POOL_MAX: 2,
    RETRIES: 5,
    DELAY: 3000,
    DEBUG: process.env.NODE_ENV === 'development',
    CLIENT: 'pg',
  },
  MODERATOR_GROUP_ID: process.env.MODERATORSID,
};
