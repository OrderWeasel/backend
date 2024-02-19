const { Pool, Client } = require('pg');

let credentials;

// Set database credentials for development or production
if (process.env.NODE_ENV === 'development') {
  // development
  credentials = {
    user: `${process.env.DEV_USER}`,
    password: `${process.env.DEV_PASSWORD}`,
    host: `${process.env.DEV_HOST}`,
    port: 5432,
    database: `${process.env.DEV_DB}`,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else if (process.env.NODE_ENV === 'production') {
  // production
  credentials = {
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    host: `${process.env.DB_HOST}`,
    port: 5432,
    database: `${process.env.DB_NAME}`,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

// Connect to database
const client = new Client(credentials);
const connectDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to ${process.env.NODE_ENV} database!`);
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
