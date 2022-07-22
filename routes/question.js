const express = require('express');
const router = express.Router();
const passport = require('passport');

console.log("inside question controller router");

const questionController = require('../controller/questionController');
const answerController = require('../controller/answerController');

router.post('/create', questionController.create);
router.post('/answer', answerController.create);


module.exports = router;