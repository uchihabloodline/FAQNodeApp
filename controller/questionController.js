const Question = require('../models/question');

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
        req.flash('success', 'Question published!');
    }catch(err){
        req.flash('error', 'Error in publishing Question!');
        console.log("ERROR in question Controller ", err);
        return res.status(500).end();
    }
};