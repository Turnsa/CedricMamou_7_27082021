const router = require("express").Router();

const postCtrl = require('../controllers/post');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, postCtrl.createPost);
router.get('/', auth, postCtrl.getAllPost);
router.get('/:id', auth, postCtrl.getPostById);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.delete('/:id', auth, multer, postCtrl.deletePost);


// comment routes
router.post('/:id/comment', auth, postCtrl.createComment);
router.get('/comment', auth, postCtrl.getAllComment);
router.delete('/comment/:id', auth, postCtrl.deleteComment);


module.exports = router;