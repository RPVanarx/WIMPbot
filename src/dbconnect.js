const { Pool } = require('pg');

const log = require('./logger')(__filename);

const dbinit = require('./dbinit');

const {
  credentials: { db },
} = require('./config');

if (!dbinit.isInitialized) {
  log.warn(`DBconnect: DB is not initialized! You should run init first!`);
}

const pool = new Pool({
  user: db.USER,
  host: db.HOST,
  database: db.DATABASE,
  password: db.PASSWORD,
  port: db.PORT,
});

pool.on('error', error => {
  log.error({ err: error }, 'DBconnect: Uncaught pool error!');
});

module.exports = pool;
