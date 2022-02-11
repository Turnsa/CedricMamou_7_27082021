const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

// const JWT_SECRET = 'zfFAa78653XG7X4fPjupMTSsLhbE4Pc67G7GeD6rcR346CNb6Ru4j5bbi4Z9';

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
    // const userId = -1;
    const token = module.exports.parseAuthorization(authorization);

    if (token != null) {
        try {
        const jwtToken = jwt.verify(token, JWT_SECRET);
        if(jwtToken != null)
            userId = jwtToken.userId;
        } catch (err) { }
    }
    return userId;
};