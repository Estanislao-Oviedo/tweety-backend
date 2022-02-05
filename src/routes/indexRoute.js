const express = require("express");
const router = express.Router();
postController = require('../controllers/postController');

const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const postRoute = require('./postRoute')

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/post', postRoute);
router.get('/feed/:page', postController.post_followed_list);
router.get('/favicon.ico', (req, res) => res.status(204));
module.exports = router;
