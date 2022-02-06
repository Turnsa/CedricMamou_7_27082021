const jwt = require('jsonwebtoken');

const JWT_SECRET = 'J3NjKqqVy5n99NDNr9ZP38uW9MDga92xrbPUMurv3z2Ye7MEk8r9c566L63R';

exports.generateToken = (userData) => {
    return jwt.sign({
        userId: userData.id,
        isAdmin: userData.isAdmin
    },
    JWT_SECRET,
    {
        expiresIn: '2h'
    })
}