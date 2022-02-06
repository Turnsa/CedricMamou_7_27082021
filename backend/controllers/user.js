const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const models = require('../models');
const asyncLib = require('async');


// regex
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

// connexion avec un compte existant
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).json({ error: 'missing parameters'})
  }

  models.User.findOne({ 
    where: {email: email }
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
          'token': jwtUtils.generateToken(user)
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
                    nom:nom,
                    prenom: prenom,
                    email: email,
                    password: bcryptPassword,
                    isAdmin: 0
                })
                    .then(newUser => { res.status(201).json({ 'id': newUser.id }) })
                    .catch(err => {
                        res.status(500).json({ err })
                    })
            })
        }
  })
  .catch(error => {
    return res.status(500).json({ 'error': 'unable to verify user'});
  });
};