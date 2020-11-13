const jwt = require('jsonwebtoken');

const RequestError = require('./request-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        console.log(req.headers)
        const token = req.header.authorization.split(' ')[1]; // Authorization Type: 'Bearer TOKEN'
        if (!token) {
            return next(Error('Authentication failed!'));
        }
        const decodedToken = jwt.verify(token, process.env.Jwt_Key);
        req.userData = {userId: decodedToken.userId};
        next();
    } catch (err) {
        const error = new RequestError(err.message + " token error", 403);
        return next(error);
    }
};