const { Pool, Client } = require('pg');

// Database credentials
const credentials = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  host: `${process.env.DB_HOST}`,
  port: 5432,
  database: `${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Connect to database
const client = new Client(credentials);
const connectDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to database!');
  } catch (error) {
    console.log('Something went wrong');
    console.log(error);
  }
};

// Pool
const pool = new Pool(credentials);

module.exports = {
  connectDatabase,
  query: (text, params) => pool.query(text, params),
};
