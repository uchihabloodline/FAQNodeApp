const Question = require('../models/question');
const questionIndex = 'questions';
const crypto = require("crypto");
const esEngine = require('../engine/engine');

// add a answer to a question
module.exports.create = async function(req, res){
    try{
        if(!req.user) {
            console.log('logged out already ');
            return;
        }
        
        let question = await Question.findById(req.body.id);

        if (question){
            if(question.answer != null){
                console.log(`Answer already submitted for the given question.`)
                return;
            }
            question.answer = req.body.answer;
            question.save();

            req.flash('success', 'Answer published!');
            console.log('success', 'Answer published!');
            res.status(200).json({
                data: question,
                message: "Answer added!"
            });
            await esEngine.indexQuestionData(questionIndex, generateUniqueID(), req);
        }

        res.status(500).end();
    }catch(err){
        req.flash('error', 'Error in publishing Answer!');
        console.log('error in answer controller', err);
        return;
    }
}

//generating random IDs for each doc/answer in ES.
function generateUniqueID() {
    return crypto.randomBytes(16).toString('hex')
  }
