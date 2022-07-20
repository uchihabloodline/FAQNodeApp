const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    tags: {
        type: String,
        require: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:    'User'
    },
    answers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:    'Answer',
        },
    ]
},{
    timestamps: true
});

const Question = mongoose.model('Question',questionSchema); 
module.exports = Question;