const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const models = require('../models');
const fs = require('fs');
// const asyncLib = require('async');

// regex
const NAME_REGEX = ("^[a-zA-Z ,.'-]+$");
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;


// connexion avec un compte existant
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).json({ error: 'missing parameters' })
  }

  models.User.findOne({
    where: { email: email }
  })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Compte utilisateur introuvable' });
      }
      bcrypt.compare(password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe invalide' });
          }
          res.status(200).json({
            userId: user.id,
            token: jwtUtils.generateToken(user)
          });
        }).catch(error => res.status(500).json({ error }));
    }).catch(error => res.status(500).json({ error }));
};


// creation d'un compte
exports.signup = (req, res, next) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;
  const password = req.body.password;
  const bio = req.body.bio;
  const photo = `${req.protocol}://${req.get('host')}/images/default/anonyme.png`;


  if (nom == null || prenom == null || email == null || password == null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }

  if (nom.length >= 15 || nom.length <= 2) {
    return res.status(400).json({ 'error': 'last name must be lenght 3-14' })
  }

  if (prenom.length >= 15 || prenom.length <= 2) {
    return res.status(400).json({ 'error': 'first name must be lenght 3-14' })
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ 'error': 'email is not valid' });
  }

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
  }

  models.User.findOne({
    attributes: ['email'],
    where: { email: email }
  }).then(user => {
    if (!user) {
      bcrypt.hash(password, 10, function (err, bcryptPassword) {
        // Création de l'user
        const newUser = models.User.create({
          nom: nom,
          prenom: prenom,
          email: email,
          password: bcryptPassword,
          bio: bio,
          imageUrl: photo,
          isAdmin: 0
        }).then(newUser => {
          res.status(201).json({ 'id': newUser.id, message: 'user create' });
        }).catch(err => {
          res.status(500).json({ err });
        })
      })
    } else {
      res.status(409).json({ 'error': 'email already used' });
    }
  }).catch(error => {
    return res.status(500).json({ error: 'unable to verify user' });
  });
};

// récupérer un profil
exports.getOneUser = (req, res, next) => {
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth);
  let id = req.params.id;
  if (userId < 0)
    return res.status(400).json({ 'error': 'wrong token' });

  models.User.findByPk(id, {
    attributes: ['id', 'nom', 'prenom', 'email', 'bio', 'imageUrl', 'isAdmin'],
  }).then(function (user) {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ 'error': 'user not found' });
    }
  }).catch(function (err) {
    res.status(500).json({ 'error': 'cannot fetch user' });
  });
},


  // récupérer tout les profils
  exports.getAllUsers = async (req, res, next) => {
    try {
      const user = await models.User.findAll({
        attributes: ['id', 'nom', 'prenom', 'email', 'bio', 'imageUrl', 'isAdmin']
      });
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).send({ error: "Erreur serveur" });
    }
  };


// modification de profil
exports.updateUser = (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const user_id = jwtUtils.getUserId(headerAuth);
  const userId = req.params.id;

  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const bio = req.body.bio;
  const password = req.body.password;


  if (user_id == userId) {
    
    if (!PASSWORD_REGEX.test(password) && password != "") {
      return res.status(435).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
    }
  
      models.User.findOne({
      attributes: ['id', 'nom', 'prenom', 'bio', 'imageUrl'],
      where: { id: userId }
    })
      .then((userFound) => {
        if (userFound != null) {
          bcrypt.hash(password, 10, function (err, bcryptPassword) {
          const updatedUser = userFound.update({
            nom: (nom != "" ? nom : userFound.nom),
            prenom: (prenom != "" ? prenom : userFound.prenom),
            bio: (bio != "" ? bio : userFound.bio),
            password: (password != "" ? bcryptPassword : userFound.password)
          }).then(userUpdated => {
            res.status(201).json({'id': userUpdated.id, message: 'user updated'});
          }).catch(err => {
            res.status(500).json({ err });
          })
        })
        } else {
          return res.status(500).json({ 'error': 'unable to verify user' })
        }
      }).catch((err) => res.status(500).json({ err }));
  } else {
    return res.status(500).json({ 'error': 'unable to verify user' })
  }
};

exports.modifyPicture = (req, res, next) => {
  let headerAuth = req.headers['authorization'];
  let user_id = jwtUtils.getUserId(headerAuth);
  let userId = req.params.id;

  let imageUrl = (req.file) ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

  if (user_id == userId) {

    models.User.findOne({
      where: {  id: userId }
    })
      .then((userFound) => {
        if (userFound != null) {
          const updatedUser = userFound.update({
            imageUrl: (imageUrl != "" ? imageUrl : userFound.imageUrl)
          }).then(pictureUpdate => {
            res.status(201).json({'id': pictureUpdate.id, message: 'user updated'});
          }).catch(err => {
            res.status(500).json({ err });
          })
        } else {
          return res.status(500).json({ 'error': 'unable to verify user' })
        }
      }).catch((err) => res.status(500).json({ err }));
    } else {
      return res.status(500).json({ 'error': 'unable to verify user' })
    }
};


// suppression d'un utilisateur
exports.deleteUser = (req, res) => {
  //récupération de l'id de l'user
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth);

  if (userId != null) {
    //Recherche sécurité si user existe bien
    models.User.findOne({
      where: { id: userId }
    }).then(user => {
      if (user != null) {
        //Delete de tous les posts et commentaires de l'user
        models.Post.destroy({ where: { userId: user.id } })
        models.Comment.destroy({ where: { userId: user.id } })
        .then(() => {
          console.log('Tous les posts de cet user ont été supprimé');
          //Suppression de l'utilisateur
          models.User.destroy({
            where: { id: user.id }
          }).then(() => res.end())
            .catch(err => console.log(err))
        }).catch(err => res.status(500).json(err))
      }
      else {
        res.status(401).json({ error: 'Cet user n\'existe pas' })
      }
    })
  } else {
    res.status(500).json({ error: 'Impossible de supprimer ce compte, contacter un administrateur' })
  }
};