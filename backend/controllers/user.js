const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const models = require('../models');
const fs = require('fs');
// const asyncLib = require('async');


// regex
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
        return res.status(401).json({ error: 'user not in DB' });
      }
      bcrypt.compare(password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'invalid password' });
          }
          res.status(200).json({
            userId: user.id,
            token: jwtUtils.generateToken(user)
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// creation d'un compte
exports.signup = (req, res, next) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;
  const password = req.body.password;


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
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(password, 10, function (err, bcryptPassword) {
          // Création de l'user
          const newUser = models.User.create({
            nom: nom,
            prenom: prenom,
            email: email,
            password: bcryptPassword,
            isAdmin: 0
          })
            .then(newUser => { res.status(201).json({ 'id': newUser.id, message: 'user create' });
          })
            .catch(err => {
              res.status(500).json({ err });
            })
        })
      } else {
        res.status(409).json({ 'error': 'email already used' });
      }
    })
    .catch(error => {
      return res.status(500).json({ 'error': 'unable to verify user' });
    });
};

// récupérer un profil
exports.getUserProfile = (req, res, next) => {
  const id = req.params.id;

  models.User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      res.status(200).json({ 
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        bio: user.bio,
        photo_profile: user.photo_profile,
        admin: user.isAdmin,
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

// modification de profil
exports.updateProfile = (req, res, next) => {
  const userId = req.params.id;

  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;
  const bio = req.body.bio;

  models.User.findOne({
    attributes: ['id', 'nom', 'prenom', 'email', 'bio'],
    where: { id: userId }
  })
  .then((userFound) => {
      if (userFound != null) {
        userFound.update ({
          nom: (nom ? nom : userFound.nom),
          prenom: (prenom ? prenom : userFound.prenom),
          email: (email ? email : userFound.email),
          bio: (bio ? bio : userFound.bio)
        })
        return res.status(201).json(userFound);
      } else {
      return res.status(500).json({ 'error': 'unable to verify user' })
      }
  }).catch((err) => res.status(500).json({ err }));
};

// suppression d'un compte
// exports.deleteProfile = (req, res, next) => {
//   // const headerAuth = req.headers['authorization'];
//   // const userId = jwtUtils.getUserId(headerAuth);
//   const userId = req.params.id;

//   if (userId != null) {
//     models.User.findByPk(userId)
//       .then (user => { 
//         if (user != null) {
//           models.User.destroy({
//             where: { id: user.id}
//           })
//           .then(() => res.end())
//           .catch(err => res.status(500).json(err));
//         }
//       })
//   } else {
//     res.status(500).json({ error: 'Impossible de supprimer ce compte' })
//   }
// };

exports.deleteProfile = (req, res) => {
  //récupération de l'id de l'user
  let userId = req.params.id;
  if (userId != null) {
      //Recherche sécurité si user existe bien
      models.User.findByPk(userId)
          .then(user => {
              if (user != null) {
                  //Delete de tous les posts de l'user même s'il y en a pas
                  // models.Post
                  //     .destroy({
                  //         where: { userId: user.id }
                  //     })
                  //     .then(() => {
                  //         console.log('Tous les posts de cet user ont été supprimé');
                          //Suppression de l'utilisateur
                          models.User
                              .destroy({
                                  where: { id: user.id }
                              })
                              .then(() => res.end())
                              .catch(err => console.log(err))
                      // })
                      .catch(err => res.status(500).json(err))
              }
              else {
                  res.status(401).json({ error: 'Cet user n\'existe pas' })
              }
          })
  } else {
      res.status(500).json({ error: 'Impossible de supprimer ce compte, contacter un administrateur' })
  }
}