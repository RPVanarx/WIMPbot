// const { Pool, Client } = require('pg');
const { Client } = require('pg');
const config = require('./config');

/*
const pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port,
});

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});
*/
const client = new Client({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port,
});

client.connect();

client.query('SELECT * FROM users', (err, res) => {
    console.log(err, res);
    client.end();
});
