const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const session = require('express-session');
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
            autoRemove: 'disabled'

        },
        function(err){
            console.log(err || 'connect-mongo setup run successful!!');
        }
    )
}));

// API
app.use('/', require('./routes/index'));

// Server
app.listen(port,function(err){
    if(err){
        console.log(`Error running the server on port ${port}`);
    }
    console.log(`Server running good on port ${port}`);
});