const router = require('express').Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const user = require('../models/user');

router.get('/:link', userController.user_get);

router.put('/:link/follow', userController.user_follow_toggle);

router.get('/:link/posts', postController.post_get_user);

router.get('/:link/replies', postController.post_get_user_replies);

router.get('/:search/search', userController.user_search);

router.put('/update', userController.user_update)

router.get('/:link/followers', userController.user_get_followers)

router.get('/:link/follows', userController.user_get_follows)

module.exports = router;