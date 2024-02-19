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

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000/',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Session
const sess = {
  secret: process.env.SECRET,
  cookie: {},
};
if (app.get('env') === 'producition') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));

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

module.exports = app;
