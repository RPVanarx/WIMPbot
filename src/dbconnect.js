const { Client } = require('pg');
const { db } = require('./config');
const migrate = require('./migrate');

const connection = () => {
  return new Promise(async res => {
    let client;
    async function dbInit() {
      await client.query(migrate.cube);
      await client.query(migrate.earthdistance);
      await client.query(migrate.createTableUser);
      await client.query(migrate.createTableRequests);
    }
    let retries = 5;
    while (retries) {
      try {
        client = new Client({
          user: db.user,
          host: db.host,
          database: db.database,
          password: db.password,
          port: db.port,
        });
        await client.connect();
        await dbInit();
        console.log('database connected');
        break;
      } catch (err) {
        retries -= 1;
        console.log(`retries left ${retries} ${err}`);
        await new Promise(res => setTimeout(res, 3000));
      }
    }
    res(client);
  });
};

module.exports = connection();
