const router = require('express').Router();
postController = require('../controllers/postController');

router.post('/', postController.post_create);

router.get('/:id', postController.post_get);

router.delete('/:id', postController.post_delete);

router.put('/:id/like', postController.post_like_toggle);

router.get('/:id/parentreplies', postController.post_get_parent_replies)

module.exports = router;