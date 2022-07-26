const Question = require('../models/question');
const Moderator = require('../models/moderators');

// add a answer to a question
module.exports.create = async function(req, res){
    try{
        let question = await Question.findById(req.body.id);

        if (question){
            question.answer = req.body.answer;
            question.save();

            req.flash('success', 'Answer published!');
            console.log('success', 'Answer published!');

            res.status(200).json({
                data: question,
                message: "Answer added!"
            });
        }

        res.status(500).end();
    }catch(err){
        req.flash('error', 'Error in publishing Answer!');
        console.log('error in answer controller', err);
        return;
    }
}
