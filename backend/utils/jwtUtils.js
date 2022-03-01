const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();


exports.generateToken = (user) => {
    return jwt.sign({
        userId: user.id,
        isAdmin: user.isAdmin
    },
    process.env.SECRET_TOKEN,
    {
        expiresIn: '2h'
    })
};

exports.parseAuthorization = (authorization) => {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
};

exports.getUserId = (authorization) => {
    let userId = -1;
    let token = module.exports.parseAuthorization(authorization);

    if (token != null) {
        try {
        let jwtToken = jwt.verify(token, process.env.SECRET_TOKEN);
        if(jwtToken != null)
            userId = jwtToken.userId;
        } catch (err) { }
    }
    return userId;
};