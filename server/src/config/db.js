const pg = require('pg');

const pgCamelCase = require('pg-camelcase');

pgCamelCase.inject(pg)
// console.log('DB_PASSWORD:', typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD);

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    max: process.env.DB_CONNECTION_LIMIT,
});

// For debugging purpose
const oldQuery = pool.query;
pool.query = function (...args) {
    const [sql, params] = args;
    console.log(`EXECUTING QUERY |`, sql, params);
    return oldQuery.apply(pool, args);
};

module.exports = pool;
