require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('./config/passport');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Render sits behind a proxy; needed so secure cookies work over HTTPS

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto', httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { defaultModelsExpandDepth: -1, withCredentials: true } // hide Models, send login cookie
  })
);
app.use('/', require('./routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
