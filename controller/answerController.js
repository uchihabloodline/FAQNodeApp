const Answer = require('../models/answer');
const Question = require('../models/question');
const Moderator = require('../models/moderators');

// add a answer to a question
module.exports.create = async function(req, res){
    try{
        let question = await Question.findById(req.body.question);
        let checkUser = await Moderator.findById(req.body.email);

        if (question && checkUser){
            let answer = await Answer.create({
                content: req.body.content,
                question: req.body.question,
                user: req.user._id
            });
            question.comments.push(comment);
            question.save();
            
            answer = await answer.populate('user', 'name email').execPopulate();
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        answer: answer
                    },
                    message: "Answer added!"
                });
            }

            console.log('success', 'Answer published!');
            res.redirect('/');
        }
    }catch(err){
        console.log('error in answer controller', err);
        return;
    }
}
