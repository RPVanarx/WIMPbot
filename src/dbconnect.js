const { Client } = require('pg');
const { db } = require('./config');
const migrate = require('./migrate');
const log = require('./logger')(__filename);

const connection = () => {
  return new Promise(async res => {
    let client;
    const dbInit = () => {
      migrate.forEach(async req => {
        await client.query(req);
      });
    };
    let retries = db.RETRIES;
    while (retries) {
      try {
        client = new Client({
          user: db.USER,
          host: db.HOST,
          database: db.DATABASE,
          password: db.PASSWORD,
          port: db.PORT,
        });
        await client.connect();
        log.info('database connected');
        break;
      } catch (error) {
        retries -= 1;
        if (!retries) {
          process.exit(1);
        }
        log.error({ err: error.message }, `retries left ${retries}`);
        await new Promise(resolve => setTimeout(resolve, db.DELAY));
      }
    }
    await dbInit();
    res(client);
  });
};

module.exports = connection();
