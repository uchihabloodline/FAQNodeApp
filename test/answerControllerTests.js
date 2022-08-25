const chai = require('chai');
const expect = chai.expect;
const answerController = require('../controller/answerController');
const questionController = require('../controller/questionController');

describe('Test suite for answer controller starts', async function(done) {
    let res = {
        sendCalledWith: '',
        json: function (arg) {
            this.sendCalledWith = arg;
        }
    };

    it('1. should prevent logged-out user to answer', async function(done) {
        let req = {
            'user': {},
            'body': {
                'answer': 'test answer to test question',
            }
        }
        answerController.create(req, res)
        .then(() => {
            expect(res.sendCalledWith.message).to.equal('logged-out user attempting to answer');
        }, (res) => {
            console.log('cannot do answer question TEST. '+res)
        }).catch((err) => {
            console.log('Error in create API of answerController. '+err);
        });
        done();
    });

    it('2. should create a question and add answer to it ', async function(done) {
        let req = {
            'user': {
                'email': 'test@test',
            },
            'body': {
                'title': 'test question created',
                'tags': 'testTag',
            }
        }
        let createdQuestion = await questionController.create(req, res);
        req.body.id = createdQuestion.data._id.toString();
        answerController.create(req, res)
        .then(() => {
            expect(res.sendCalledWith.message).to.equal('Answer added!');
        }, (res) => {
            console.log('cannot do answer question TEST. '+res)
        }).catch((err) => {
            console.log('Error in create API of answerController. '+err);
        });
        done();
    });
});