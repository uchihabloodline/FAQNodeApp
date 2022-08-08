const Question = require('../models/question');
const esEngine = require('../engine/engine');
const loggerConfigLog4js = require('../config/loggerConfigLog4js');
const questionIndex = 'questions';

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
        logger.info({message: 'question created'});
        await esEngine.indexQuestionData(questionIndex, question._id.toString(), req);
        req.flash('success', 'Question published!');
    }catch(err){
        req.flash('error', 'Error in publishing Question!');
        logger.error({message: `Error in question Controller. Error: ${JSON.stringify(err)}`});
        return res.status(500).end();
    }
};