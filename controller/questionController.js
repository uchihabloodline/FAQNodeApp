const Question = require('../models/question');
const esEngine = require('../engine/engine');
const questionIndex = 'questions';
const esQuestionIndexId = 'q1';

module.exports.create = async function(req,res){
    try{
        let question = await Question.create({
            title: req.body.title,
            tags: req.body.tags,
            // user: req.user._id,
        });
        res.status(200).json({
            data: question,
            message: "question created!",
        });
        await esEngine.indexQuestionData(questionIndex, esQuestionIndexId, req);
        req.flash('success', 'Question published!');
    }catch(err){
        req.flash('error', 'Error in publishing Question!');
        console.log("ERROR in question Controller ", err);
        return res.status(500).end();
    }
};