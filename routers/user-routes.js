var express = require('express');
var router = express.Router();
var userController = require('../controllers/user-controller')
var middleware = require('../middlewares/userMiddleware')


//get requests
router.get('/test',userController.test);
//auth required
router.get('/user/:id', middleware.authenticate, userController.getUser);


//post requests
router.post('/signup',userController.signup);
router.post('/auth/signin',userController.signin);
//auth required
router.post('/company', middleware.authenticate, userController.createCompany);
router.post('/company/board', middleware.authenticate, userController.addBoard);





module.exports = router;