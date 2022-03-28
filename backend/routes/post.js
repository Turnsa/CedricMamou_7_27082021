const router = require("express").Router();

const postCtrl = require('../controllers/post');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.get('/', auth, postCtrl.getAllPost);
// router.get('/:id', auth, postCtrl.getPostByUser);
router.post('/', auth, multer, postCtrl.createPost);
router.delete('/:id', auth, multer, postCtrl.deletePost);


// comment routes
router.post('/:id/comment', auth, postCtrl.createComment);
router.get('/comment', auth, postCtrl.getAllComment);
router.delete('/comment/:id', auth, postCtrl.deleteComment);


module.exports = router;