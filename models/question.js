const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    tags: {
        type: [
        {
            type: String,
            require: true,
        }
    ],
    'default': []
},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    answer: {
        type: String,
    }
},{
    timestamps: true
});

//questionSchema.index({'answer': 'text'});
questionSchema.index({title: "text", "tags": "text"});

const Question = mongoose.model('Question',questionSchema); 
module.exports = Question;