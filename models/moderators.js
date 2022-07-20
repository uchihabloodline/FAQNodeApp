const mongoose  = require('mongoose');

const moderatorSchema = new mongoose.Schema({
    email:{
        type: String,
        required:  true,
        unique:    true,
    }
},{
    timestamps: true
});

const Moderator = mongoose.model('Moderator', moderatorSchema);

module.exports = Moderator;