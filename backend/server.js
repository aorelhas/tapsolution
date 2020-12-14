import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import colors from 'colors';
import morgan from 'morgan';
import session from 'express-session';

import connectDB from './config/db.js';

/**
 * Controllers (route handlers).
 */
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB();


// import passportConfig from './config/passport.js'

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
    cookie: { secure: true, maxAge: '2d' }, // two weeks in milliseconds
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

/**
 * Primary app routes.
 */
app.use('/auth', userRoutes)

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold
  )
);
