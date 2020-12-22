const errors = require('restify-errors');
const Users = require('../MySQLData/Users');

module.exports = server => {
    server.post('/register', (req, res, next) => {
        Users.CreateNewUser(req.body)
        .then(data => {
            if (data.exists) {
                const error = new errors.InvalidArgumentError();
                global.logger.error(error);
                res.send(error);
                return;
            }

            const { token, exp, user } = data;
            res.send(201, {
                token,
                exp,
                user,
            });
        })
        .catch(error => {
            global.logger.error(error);
            res.send(error.code, error.message);
        });
        next();
    });
    
    server.post('/login', (req, res, next) => {
        Users.LoginAUser(req.body)
        .then(data => {
            const { token, exp, user } = data;
            res.send(data.code, { token, exp, user });
        })
        .catch(error => {
            global.logger.error(error);
            res.send(error.code, error.message);
        });
        next();
    });
};