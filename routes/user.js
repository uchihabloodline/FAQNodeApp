const express = require('express');
const router = express.Router();

console.log("user controller working!!");

const userController = require('../controller/userController');

router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);
router.post('/create',userController.create);
router.post('/create-session', userController.createSession);

router.get('/sign-out', userController.destroySession);


module.exports = router;