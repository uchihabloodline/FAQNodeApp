const Question = require('../models/question');
const Answer = require('../models/answer');

module.exports.create = async function(req,res){
    try{
        let question = await Question.create({
            title: req.body.title,
            tag: req.body.tag,
            user: req.user._id,
        });
        if(req.xhr){
            return res.status(200).json({
                data:{
                    question: question
                },
                    message: "question created!",
            });
        }
        return res.redirect('back');
    }catch(err){
        console.log("ERROR in question Controller ",err);
        return res.redirect('back');
    }
};