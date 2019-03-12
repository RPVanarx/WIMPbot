const { Client } = require('pg');
const { db } = require('./config');
const migrate = require('./migrate');

const client = new Client({
  user: db.user,
  host: db.host,
  database: db.database,
  password: db.password,
  port: db.port,
});

async function dbInit() {
  await client.query(migrate.cube);
  await client.query(migrate.earthdistance);
  await client.query(migrate.createTableUser);
  await client.query(migrate.createTableRequests);
}

const createConnection = async () => {
  try {
    await client.connect();
    await dbInit();
    console.log('connected to base');
  } catch (err) {
    console.log(err);
  }
};

createConnection();

module.exports = client;
