const pool = require('../config/db');

async function findUserByEmail(email) {
  const result = await pool.query('SELECT user_id, username, email, password_hash FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function createUser(username, email, passwordHash) {
  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email',
    [username, email, passwordHash]
  );
  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  createUser,
};
