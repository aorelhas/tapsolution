const express = require('express')
const dotenv = require ('dotenv');
const passport = require ('passport');
const colors = require ('colors');
const morgan = require ('morgan');
const session = require ('express-session');

const connectDB = require( './config/db.js');

/**
 * Controllers (route handlers).
 */
const userRoutes = require( './routes/userRoutes.js');

dotenv.config();

// Passport config
require('./config/passport')(passport)

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Express-Session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true, maxAge: '2d' }, // two weeks in milliseconds
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

/**
 * Primary app routes.
 */
app.use('/auth', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold
  )
);
