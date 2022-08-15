const chai = require('chai');
const expect = chai.expect;
const questionController = require('../controller/questionController');

describe('testing the question controller', async function(done) {
    let res = {
        sendCalledWith: '',
        json: function (arg) {
            this.sendCalledWith = arg;
        }
    };

    it('1. should create a question normally', async function(done) {
        let req = {
            'body': {
                'title': 'test question created',
                'tags': 'testTag'
            }
        }
        questionController.create(req, res)
        .then(() => {
            expect(res.sendCalledWith.message).to.equal('question created!');
        }, (res) => {
            console.log('cannot do create question TEST. '+res)
        }).catch((err) => {
            console.log('Error in create API of questionController. '+err);
        });
        done();
    });

    it('2. should not create a question with empty title and tag', async function(done) {
        let req = {
            'body': {
                'title': '',
                'tags': ''
            }
        }
        questionController.create(req, res)
        .then(() => {
            expect(res.sendCalledWith.message).to.equal('title length should be more than a letter');
        }, (res) => {
            console.log('empty title create API rejected. '+res)
        }).catch((err) => {
            console.log('Error in create API of questionController  '+err);
        });
        done();
    });

    it('3. should create a question with empty tags', async function(done) {
        let req = {
            'body': {
                'title': 'question without tags',
                'tags': ''
            }
        }
        questionController.create(req, res)
        .then(() => {
            expect(res.sendCalledWith.message).to.equal('question created!');
        }, (res) => {
            console.log('empty tags test block issue. '+res)
        }).catch((err) => {
            console.log('Error in create API of questionController  '+err);
        });
        done();
    });

    it('4. should not create a question with empty title and non-empty tags', async function(done) {
        let req = {
            'body': {
                'title': '',
                'tags': ['tag1', 'tag2']
            }
        }
        questionController.create(req, res)
        .then(() => {
            expect(res.sendCalledWith.message).to.equal('title length should be more than a letter');
        }, (res) => {
            console.log('empty title with non-empty tags test block issue. '+res)
        }).catch((err) => {
            console.log('Error in create API of questionController  '+err);
        });
        done();
    });
});