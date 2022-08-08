const Question = require('../../models/question');
const _ = require('lodash');
const esSearch = require('../../engine/engine');
const questionIndex = 'questions';

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
        let questions = searchText != null ? await esSearch.search(questionIndex, searchText) : await Question.find(findQuery);
        if(!_.isEmpty(searchText) && questions.body.hits.hits){
            return res.render('faq_home', {
                questions: questions.body.hits.hits.map(q => ({...q._source, _id: q.id})),
                canAnswer: true,
            });
        }
        return res.render('faq_home', {
            questions: questions,
            canAnswer: true
        });
    }catch(err){
        logger.error({message: `Error in question Controller! Error: ${JSON.stringify(err)}`});
        return res.redirect('back');
    }
}