const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../index');
const userController = require('../controller/userController');

describe('testing user controller ', async function(done) {
    let res = {
        sendCalledWith: '',
        json: function (arg) {
            this.sendCalledWith = arg;
        }
    };

    const userCredentials = {
            email: 'shivam.pandey@payu.in', 
            password: '1234'
      }
    
    // now let's login the user before we run any tests
    // CAUTION: request would turn on server hence the server in main app must be closed.
    // Or just use a different port. 
    let authenticatedUser = request.agent(app);

    before('--> it should not create a session and return 302', function(done){
        authenticatedUser
            .post('/user/create-session')
            .send(userCredentials)
            .end(function(err, response){
                expect(response.statusCode).to.equal(302);
                expect('Location', '/');
                done();
          });
      });

    it('1. should not sign-in user with unregistered moderator email', async function(done) {
        let req = {
            'user': {
                'email': 'shivam.pandey@payu.in',
            },
            'body': {
                'email': 'foo@bar.com'
            }
        }

        userController.signIn(req, res)
        .then(() => {
            expect(res.sendCalledWith.message).to.equal('Another session in progress');
        }, (res) => {
            console.log('cannot do sign-in user controller TEST. '+res)
        }).catch((err) => {
            console.log('Error in sign-in API of userController. '+err);
        });
        done();
    });

    it('2. check sign-in user API with registered moderator email', async function(done) {
        let req = {
            'user': {
                'email': 'foo@bar.com',
            },
            'body': {
                'email': 'foo@bar.com'
            }
        }

        userController.signIn(req, res)
        .then(() => {
            expect(res.sendCalledWith.message).to.equal('sign-in execution successful');
        }, (res) => {
            console.log('cannot do sign-in user controller success TEST. '+res)
        }).catch((err) => {
            console.log('Error in sign-in API of userController. '+err);
        });
        done();
    });

    describe('test suite for user sign-up API', async function(done) {
        let req = {
            'body': {
                'email': 'foo@bar.com',
                'password': 'foo',
                'confirm_password': 'foo'
            }
        }

        it('1. should check for unmatching passwords', async function(done) {
            let req = {
                'body': {
                    'email': 'shivam.pandey@payu.in',
                    'password': 'foo',
                    'confirm_password': 'bar'
                }
            }
    
            userController.create(req, res)
            .then(() => {
                expect(res.sendCalledWith.message).to.equal('password do not match');
            }, (res) => {
                console.log('cannot do create user API controller failure TEST. '+res)
            }).catch((err) => {
                console.log('Error in create API of userController. '+err);
            });
            done();
        });

        it('2. should check for unmatching passwords', async function(done) {
            let req = {
                'body': {
                    'email': 'does.not.exist@moderator',
                    'password': 'foo',
                    'confirm_password': 'foo'
                }
            }
    
            userController.create(req, res)
            .then(() => {
                expect(res.sendCalledWith.message).to.equal('Email does not exist in Moderator model');
            }, (res) => {
                console.log('cannot do create user API controller Moderator check TEST. '+res)
            }).catch((err) => {
                console.log('Error in create API of userController. '+err);
            });
            done();
        });
    })


});

