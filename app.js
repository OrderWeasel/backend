const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { Client } = require('pg');

// Require dotenv
require('dotenv').config();

// Connect to database
const client = new Client({
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  host: `${process.env.DB_HOST}`,
  port: 5432,
  database: 'orderweasel_db',
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to database!');
  } catch (error) {
    console.log(error);
  }
};
connectDatabase();

// Import files from `routes` folder
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const helloworldRouter = require('./routes/api/helloworld');
const merchantRouter = require('./routes/api/merchant');

const app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// API Routes
app.use('/api', helloworldRouter);
app.use('/api', merchantRouter);

module.exports = app;
