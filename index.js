const express = require('express');
const app = express();
const port = 8080; // process.env.PORT;
// const host = process.env.HOST;
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const passportLocal = require('./config/passport-local-strategy');
const flash = require('connect-flash');
const customWare = require('./config/middleware');
const { Client } = require('@elastic/elasticsearch');
const Engine = require('./engine/engine');

if (process.env.NODE_ENV != 'production') {
    require('dotenv').config(); 
  }


//elastic search client connection.
global.client = new Client({
    node: process.env.ES_NODE_URL
  });

  // Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//setting static path for css/js
app.use(express.static('./assets'));

//setting view engine
app.set('view engine','ejs');
app.set('views','./views');

//db connect
app.use(session({
    name: process.env.SESSION_NAME,
    //TODO--> need to change secret if deployment
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(  
        {   
            mongoUrl: process.env.MONGO_URL,
            mongooseConnection: db,
            autoRemove: 'disabled',

        },
        function(err){
            console.log(err || 'connect-mongo setup run successful!!');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//adding custom flash cards 
app.use(flash());
app.use(customWare.setFlash);

// API
app.use('/', require('./routes/index'));

// Server
app.listen(process.env.PORT, process.env.HOST, function(err){
    if(err){
        console.log(`Error running the server on port ${port}`);
    }
    console.log(`Server running good on port ${port}`);
    console.log('total no. of indices in elasticsearch');
    Engine.indices();
});