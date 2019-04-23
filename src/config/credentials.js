require('dotenv').config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TOKEN,
  VIBER_TOKEN: process.env.VIBER_TOKEN,
  db: {
    USER: process.env.PGUSER,
    HOST: process.env.PGHOST,
    DATABASE: process.env.PGDATABASE,
    PASSWORD: process.env.PGPASSWORD,
    PORT: process.env.PGPORT,
    RETRIES: 5,
    DELAY: 3000,
  },
  MODERATOR_GROUP_ID: process.env.MODERATORSID,
};
