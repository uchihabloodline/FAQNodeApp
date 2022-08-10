/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable no-undef */
const _ = require('lodash');
const Question = require('../../models/question');
const esSearch = require('../../engine/engine');

const questionIndex = 'questions';

module.exports.home = async function (req, res) {
  const searchText = req.query.search;
  const { tags } = req.query;

  let findQuery = {};

  if (!_.isEmpty(searchText)) {
    findQuery = {
      ...findQuery,
      $text: { $search: searchText },
    };
  }

  if (!_.isEmpty(tags)) {
    findQuery = {
      ...findQuery,
      tags: { $in: _.castArray(tags) },
    };
  }

  try {
    const questions = searchText != null ? await esSearch.search(questionIndex, searchText)
      : await Question.find(findQuery);
    if (!_.isEmpty(searchText) && questions.body.hits.hits) {
      return res.render('faq_home', {
        // eslint-disable-next-line no-underscore-dangle
        questions: questions.body.hits.hits.map((q) => ({ ...q._source, _id: q._id })),
        canAnswer: true,
      });
    }
    return res.render('faq_home', {
      questions,
      canAnswer: true,
    });
  } catch (err) {
    logger.error({ message: `Error in question Controller! Error: ${JSON.stringify(err)}` });
    return res.redirect('back');
  }
};
