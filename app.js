// Require dotenv
require('dotenv').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const { connectDatabase } = require('./config/db');

// Connect to AWS RDS PostgreSQL database
connectDatabase();

// Import files from `routes` folder
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const merchantsRouter = require('./routes/api/merchants/index');
const connectSquareRouter = require('./routes/api/connectSquare/index');
const signupRouter = require('./routes/api/signup/index');
const loginRouter = require('./routes/api/login/index');
const resetDatabaseRouter = require('./routes/api/reset/index');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8081/',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {},
}));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// API Routes
app.use('/api/merchants', merchantsRouter);
app.use('/api/connect-square', connectSquareRouter);
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
// app.use('api/reset', resetDatabaseRouter);

module.exports = app;
