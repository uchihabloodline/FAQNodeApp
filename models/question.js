const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    tags: [
        {
            type: String,
        }
    ],
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
questionSchema.index({tags: "text", "answer": "text"});

const Question = mongoose.model('Question',questionSchema); 
module.exports = Question;