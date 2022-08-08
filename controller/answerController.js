const Question = require('../models/question');
const questionIndex = 'questions';
const crypto = require("crypto");
const esEngine = require('../engine/engine');

// add a answer to a question
module.exports.create = async function(req, res){
    try{
        if(!req.user) {
            req.flash('error', 'logged out already');
            logger.info({message: 'logged out already '});
            return res.redirect('/'); 
        }
        
        let question = await Question.findById(req.body.id);

        if (question){
            if(question.answer != null){
                req.flash('error', 'Answer already submitted for the given question.');
                logger.info({message: `Answer already submitted for the given question.`});
                return;
            }
            question.answer = req.body.answer;
            question.save();

            req.flash('success', 'Answer published!');
            logger.info({message: 'Success! '+ 'Answer published!'});
            res.status(200).json({
                data: question,
                message: "Answer added!"
            });
            await esEngine.addAnswerToQuestion(questionIndex, question._id.toString(), req);
        }

        res.status(500).end();
    }catch(err){
        req.flash('error', 'Error in publishing Answer!');
        logger.error({message: `Error in answer controller. Error: ${JSON.stringify(err)}`});
        return;
    }
}
