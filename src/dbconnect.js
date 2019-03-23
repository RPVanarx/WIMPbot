const { Pool } = require('pg');
const { db } = require('./config');
const migrate = require('./migrate');
const log = require('./logger')(__filename);

const pool = new Pool({
  user: db.USER,
  host: db.HOST,
  database: db.DATABASE,
  password: db.PASSWORD,
  port: db.PORT,
});

pool.on('error', error => {
  log.error({ err: error.message }, 'DB: Uncaught pool error!');
});

async function init(dbPool, triesLeft) {
  let client = null;
  try {
    client = await dbPool.connect();
    log.info('DB init: connected - got client');
  } catch (error) {
    if (client) client.release();

    log.error({ err: error.message }, `DB init: Failed to connect! Attempts left: ${triesLeft}`);
    const tries = triesLeft - 1;

    if (!tries) {
      log.error({ err: error.message }, 'DB init: Unable to connect to database!');
      process.exit(1);
    }
    setTimeout(() => init(dbPool, tries), db.DELAY);
    return;
  }

  try {
    if (!client) throw new Error('Cannot init! Client not ready!');
    // eslint-disable-next-line no-restricted-syntax
    for await (const request of migrate) {
      try {
        await client.query(request);
      } catch (error) {
        log.error({ err: error.message }, `Cannot execute request: ${request}`);
      }
    }
  } catch (error) {
    log.error({ err: error.message }, `DB init: Cannot init!`);
  } finally {
    if (client) client.release();
  }
}

init(pool, db.RETRIES);

module.exports = pool;
