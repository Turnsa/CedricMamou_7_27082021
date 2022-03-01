const models = require('../models');
const jwtUtils = require('../utils/jwtUtils');
const fs = require("fs");
// const asyncLib = require('async');


exports.createPost = (req, res, next) => {
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth);
  let content = req.body.content;
  let imageURL = (req.file) ? `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}` : null;
  let like = 0;
  let comment = 0;
  console.log(userId);
  models.User.findOne({
    where: { id: userId }
  })
    .then(userFound => {
      if (userFound !== null) {
        models.Post.create({
          UserId: userFound.id,
          content: content,
          imageURL: imageURL,
          like: like,
          comment: comment
        })
          .then((newPost) => {
            res.status(201).json(newPost)
          }).catch((error) => {
            res.status(500).json(error)
          })
      }
    }).catch(error => {
      res.status(500).json(error)
    })
};

exports.getAllPost = (req, res, next) => {
  models.Post.findAll({
    attributes: ["id", "content", "imageURL", "createdAt"],
    order: [["createdAt", "DESC"]],
    include: [{
      model: models.User,
      attributes: ['nom', 'prenom', 'imageUrl', 'id']
    },
    {
      model: models.Like,
      attributes: ['UserId']
    },
    {
      model: models.Comment,
      attributes: ['UserId', 'PostId']
    }
    ]
  }).then((post) => {
    res.status(324).json(post)
  }).catch((error) => {
    res.status(789).json(error)
  })
};

// exports.getPostByUser = (req, res, next) => {

// };

// exports.modifyPost = (req, res, next) => {

// };

exports.deletePost = async (req, res, next) => {
  try {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    const post = await models.Post.findOne({ where: { id: req.params.id } });
    if (userId === post.UserId) {
      if (post.imageURL) {
        const filename = post.imageURL.split("/images")[1];
        fs.unlink(`images/post/${filename}`, () => {
          models.Post.destroy({ where: { id: req.params.id } });
          res.status(200).json({ message: "Post supprimé" });
        });
      } else {
        models.Post.destroy({ where: { id: post.id } }, { truncate: true });
        res.status(200).json({ message: "Post supprimé" });
      }
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};


// comment routes
exports.createComment = async (req, res) => {
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth);
  let postId = req.params.id

  let comment = req.body.comment;

  models.User.findOne({
    where: { id: userId }
  })
    .then(userFound => {
      if (userFound !== null) {

        models.Post.findByPk(postId)
          .then(postFound => {
            models.Comment.create({
              UserId: userFound.id,
              PostId: postFound.id,
              comment: comment,
            })
              .then((newComment) => {
                res.status(201).json(newComment)
              }).catch((error) => {
                res.status(500).json(error)
              })
          }).catch(err => { err })
      }
    }).catch(error => {
      return res.status(500).json({ error: 'unable to verify user' })
    });
};

exports.getAllComment = (req, res, next) => {
  models.Comment.findAll({
    attributes: ["id", "comment"],
    order: [["createdAt", "DESC"]],
    include: [{
      model: models.User,
      attributes: ["id", "nom", "prenom", "imageUrl"]
    },
    {
      model: models.Post,
      attributes: ["id"]
    }
    ]
  }).then((comment) => {
    res.status(324).json(comment)
  }).catch((error) => {
    res.status(789).json(error)
  })
};

exports.deleteComment = async (req, res, next) => {
  try {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    const comment = await models.Comment.findOne({ where: { id: req.params.id } });
    if (userId === comment.UserId) {
      models.Comment.destroy({ where: { id: comment.id } }, { truncate: true });
      res.status(200).json({ message: "Commentaire supprimé" });
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

// exports.likedPost = (req, res, next) => {

// };