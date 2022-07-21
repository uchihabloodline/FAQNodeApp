const Question = require('../models/question');

module.exports.getTagQuestions = async function(req, res) {
    try{
        let tagQuestions = await Question.find({tags: req.body.tag}, function (err, questions) {
            if(err) {
                console.log("error in finding similar tag questions");
                return;
            }
            if(tagQuestions == null) {
                console.log("No similar tagged questions found!");
                return;
            }
            console.log("Found same tagged questions-> "+questions);
        });
        return res.render("faq", {
            questions: tagQuestions
        });

    }catch(err) {

    }
    
}