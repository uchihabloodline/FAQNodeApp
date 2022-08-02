const Question = require('../../models/question');
const _ = require('lodash');
const esSearch = require('../../engine/engine');
const questionIndex = 'questions';
const esQuestionIndexId = 'q1';

module.exports.home = async function (req, res) {
    const searchText = req.query.search;
    const tags = req.query.tags;

    let findQuery = {};

    if(!_.isEmpty(searchText)) {
        findQuery = {
            ...findQuery,
            $text: { $search: searchText }
        }
    }

    if(!_.isEmpty(tags)) {
        findQuery = {
            ...findQuery,
            tags: { $in: _.castArray(tags) }
        }
    }

    try{
        let questions = searchText != null ? esSearch.searchQueries(questionIndex, searchText) : await Question.find(findQuery);
        //let questions = await Question.find(findQuery);
        return res.render('faq_home', {
            questions: questions,
            canAnswer: true
        });
    }catch(err){
        console.log("ERROR in question Controller ",err);
        return res.redirect('back');
    }
}