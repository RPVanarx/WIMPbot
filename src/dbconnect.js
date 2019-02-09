const { Client } = require('pg');
const { db } = require('./config');

const client = new Client({
    user: db.user,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,
});

client.connect();

module.exports = client;
