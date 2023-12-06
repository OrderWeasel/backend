// Require dotenv
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { connectDatabase } = require('./config/db');

// Connect to AWS RDS PostgreSQL database
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
