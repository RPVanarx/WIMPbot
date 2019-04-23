const { Pool } = require('pg');
const {
  credentials: { db: DB },
} = require('./config');
const migrate = require('./migrate');
const log = require('./logger')(__filename);

const pool = new Pool({
  user: DB.USER,
  host: DB.HOST,
  database: DB.DATABASE,
  password: DB.PASSWORD,
  port: DB.PORT,
  max: 1,
});

pool.on('error', error => {
  log.error({ err: error }, 'DB init: Uncaught pool error!');
});

let isInitialized = false;

async function initDb(dbPool, triesLeft) {
  if (isInitialized) log.warn('DB init: DB has already been initialized!');

  let client = null;
  try {
    client = await dbPool.connect();
    log.info('DB init: connected - got client');
  } catch (error) {
    if (client) client.release();

    log.error({ err: error }, `DB init: Failed to connect! Attempts left: ${triesLeft}`);
    const tries = triesLeft - 1;

    if (!tries) {
      log.error({ err: error }, 'DB init: Unable to connect to database!');
      process.exit(1);
    }
    setTimeout(() => initDb(dbPool, tries), DB.DELAY);
    return;
  }

  if (!client) {
    const err = new Error('DB init: Cannot init! DB client not ready!');
    log.error({ err }, err.message);
    process.exit(1);
  }
  // eslint-disable-next-line no-restricted-syntax
  for await (const request of migrate) {
    try {
      await client.query(request);
    } catch (error) {
      if (client) client.release();

      log.error({ err: error }, `DB init: Cannot execute request: ${request}`);
      process.exit(1);
    }
  }

  isInitialized = true;
  if (client) client.release();

  try {
    await pool.end();
    log.info('DB init: done - ending pool');
  } catch (error) {
    log.error({ err: error }, 'DB init: Cannot end pool!');
    process.exit(1);
  }
}

module.exports = {
  get isInitialized() {
    return isInitialized;
  },
  init: () => initDb(pool, DB.RETRIES),
};
