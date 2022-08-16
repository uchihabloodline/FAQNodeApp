/* eslint-disable no-unused-vars */
const express = require('express');

const app = express();
const port = 8080; // process.env.PORT;
global.config = require('./config/config');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
global.logger = require('./config/logger');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
const { Client } = require('@elastic/elasticsearch');
const { config } = require('dotenv');
const passportLocal = require('./config/passport-local-strategy');
const customWare = require('./config/middleware');
const Engine = require('./engine/engine');
const db = require('./config/mongoose');

// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV != 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

// elastic search client connection.
global.client = new Client({
  node: process.env.PAYU_ES_URL,
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// setting static path for css/js
app.use(express.static('./assets'));

// setting view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// db connect
app.use(session({
  name: process.env.SESSION_NAME,
  // TODO--> need to change secret if deployment
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: config.maxCookieAge,
  },
  store: MongoStore.create(
    {
      mongoUrl: process.env.MONGO_URL,
      mongooseConnection: db,
      autoRemove: config.MongoStore_disabled,
    },
    (err) => {
      console.log(err || 'connect-mongo setup run successful!!');
    },
  ),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// adding custom flash cards
app.use(flash());
app.use(customWare.setFlash);

// API
app.use('/', require('./routes/index'));

// Server
app.listen(process.env.PORT, process.env.HOST, async (err) => {
  if (err) {
    console.log(`Error running the server on port ${port}`);
  }
  console.log(`Server running good on port ${port}`);
  console.log('total no. of indices in elasticsearch');
  // eslint-disable-next-line no-undef
  logger.debug({ message: 'total no. of indices in elasticsearch' });
  // eslint-disable-next-line no-undef
  logger.debug({ message: `${await Engine.indices()}` });
  await Engine.indices();
});

module.exports = app.listen(process.env.PORT);
