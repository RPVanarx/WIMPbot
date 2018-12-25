// const { Pool, Client } = require('pg');
const { Client } = require('pg');
const { db } = require('./config');

/*
const pool = new Pool({
    user: db.user,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,
});

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});
*/
const client = new Client({
    user: db.user,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,
});

client.connect();

client.query('SELECT * FROM users', (err, res) => {
    console.log(err, res);
    client.end();
});
