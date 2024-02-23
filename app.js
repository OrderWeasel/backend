// Require dotenv:
require('dotenv').config();

// Import libraries:
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const { connectDatabase } = require('./config/db');

// Import files from `routes` folder:
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const merchantsRouter = require('./routes/api/merchants/index');
const connectSquareRouter = require('./routes/api/connectSquare/index');
const signupRouter = require('./routes/api/signup/index');
const loginRouter = require('./routes/api/login/index');
const resetDatabaseRouter = require('./routes/api/reset/index');

// Initialize the Node.js Express application:
const app = express();

// Connect to AWS RDS PostgreSQL database:
connectDatabase();

// CORS configuration:
const corsOptions = {
  origin: 'http://localhost:8081/',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Middleware:
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure redis client:
const redisClient = createClient();

// Connect to redis client:
redisClient.connect().then(console.log('Redis connected!')).catch(console.log);

// Initialize redis store:
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:',
});

// Session middleware:
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // Only set to true if you are using HTTPS.
      // Secure Set-Cookie attribute.
      secure: false,
      // Only set to true if you are using HTTPS.
      httpOnly: false,
      // Session max age in milliseconds. (1 min)
      // Calculates the Expires Set-Cookie attribute
      maxAge: 600000,
    },
  }),
);

// Session checker:
const sessionChecker = (req, res, next) => {
  console.log(`Session Checker: ${req.session.id}`.green);
  console.log(req.session);
  if (req.session.user) {
    console.log('Found User Session'.green);
    next();
  } else {
    console.log('No User Session Found'.red);
    res.status(400).json({ message: 'Please login or sign up to continue.'})
  }
};

// Routes:
app.use('/', indexRouter);
app.use('/users', usersRouter);

// API Routes:
app.use('/api/merchants', sessionChecker, merchantsRouter);
app.use('/api/connect-square', connectSquareRouter);
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
// app.use('/api/reset', resetDatabaseRouter);

module.exports = app;
