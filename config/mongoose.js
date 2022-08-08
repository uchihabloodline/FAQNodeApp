const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/FaqApp');
const mongodb = mongoose.connection;

mongodb.on('error',console.error.bind(console,'failed to connect MongoDb!!'));

mongodb.once('open',function(){
    logger.info({message: "successfully connected to database!!"});
});

module.exports = mongodb;