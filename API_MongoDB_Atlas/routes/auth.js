const errors = require('restify-errors');
const User = require('../mongoose/user/UserData');

module.exports = server => {
    server.post('/register', async(req, res, next) => {
        try {
            const { code, token, exp, user } = await User.CreateNewUser(req.body);
            if (token && exp && user) {
                res.send(code, { token, exp, user });
            } else {
                res.send(code);
            }
            next();
        }
        catch(error) {
            global.logger.error(new errors.InternalError(error.message));
            return next(new errors.InternalError(error.message));
        }
    });
    
    server.post('/login', async(req, res, next) => {
        try {
            const { code, token, exp, user } = await User.LoginAUser(req.body);
            if (token && exp && user) {
                res.send(code, { token, exp, user });
            } else {
                res.send(code);
            }
            next();
        }
        catch(error) {
            global.logger.error(new errors.InternalServerError(error.message));
            return next(new errors.InternalServerError());
        }
    });
};