const router = require('express').Router();
authController = require('../controllers/authController');


router.post('/signup', authController.auth_signup);

router.post('/login', authController.auth_login);

router.get('/checkifloggedin', authController.auth_checkIfLoggedIn);

router.post('/logout', authController.auth_logOut);

module.exports = router;