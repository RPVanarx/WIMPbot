const log = require('./logger')(__filename);

const { DB } = require('./config/credentials');

module.exports = {
  development: {
    client: DB.CLIENT,
    connection: {
      user: DB.USER,
      host: DB.HOST,
      database: DB.DATABASE,
      password: DB.PASSWORD,
      port: DB.PORT,
    },
    pool: {
      min: DB.POOL_MIN,
      max: DB.POOL_MAX,
    },

    debug: DB.DEBUG,
    asyncStackTraces: DB.DEBUG,

    log: {
      warn(message) {
        log.warn(message);
      },
      error(message) {
        log.error(message);
      },
      deprecate(message) {
        log.warn(message);
      },
      debug(message) {
        log.info(message);
      },
    },

    migrations: {
      tableName: 'knexMigrations',
    },
  },

  production: {
    client: DB.CLIENT,
    connection: {
      user: DB.USER,
      host: DB.HOST,
      database: DB.DATABASE,
      password: DB.PASSWORD,
      port: DB.PORT,
    },
    pool: {
      min: DB.POOL_MIN,
      max: DB.POOL_MAX,
    },

    log: {
      warn(message) {
        log.warn(message);
      },
      error(message) {
        log.error(message);
      },
      deprecate(message) {
        log.warn(message);
      },
    },

    migrations: {
      tableName: 'knexMigrations',
    },
  },
};
