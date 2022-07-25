const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const passportLocal = require('./config/passport-local-strategy');
// const LocalStrategy = require("passport-local");
// const passportLocalMongoose = require("passport-local-mongoose");

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
    name: 'FaqApp',
    //TODO--> need to change secret if deployment
    secret: 'anything',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(  
        {   
            mongoUrl: "mongodb://localhost/FaqApp",
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

// API
app.use('/', require('./routes/index'));

// Server
app.listen(port,function(err){
    if(err){
        console.log(`Error running the server on port ${port}`);
    }
    console.log(`Server running good on port ${port}`);
});