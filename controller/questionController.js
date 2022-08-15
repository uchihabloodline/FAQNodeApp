/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-undef */
const Question = require('../models/question');
const esEngine = require('../engine/engine');

const questionIndex = 'questions';

module.exports.create = async function (req, res) {
  try {
    if((req.body.title).length <= 1) {
      req.flash('error', 'title cannot be empty');
      return res.status(200).json({message: 'title length should be more than a letter'});
    }
    const question = await Question.create({
      title: req.body.title,
      tags: req.body.tags,
      // user: req.user._id,
    });
    logger.info({ message: 'question created' });
    // eslint-disable-next-line no-underscore-dangle
    await esEngine.indexQuestionData(questionIndex, question._id.toString(), req);
    req.flash('success', 'Question published!');
    return res.status(200).json({
      data: question,
      message: 'question created!',
    });
  } catch (err) {
    req.flash('error', 'Error in publishing Question!');
    logger.error({ message: `Error in question Controller. Error: ${JSON.stringify(err)}` });
    return res.status(500).json({message: 'Error in create API of questionController'});
  }
};
