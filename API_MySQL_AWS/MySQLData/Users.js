const db = require('./index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errors = require('restify-errors');

function GetUserData(data) {
    return new Promise((resolve, reject) => {
        const qry = "SELECT * FROM users WHERE email = ?";
        db.pool.query(qry, [data.email], (err, rows) => {
            if (err) {
                return reject({
                    code: new errors.InternalServerError(),
                    message: err, 
                    exists: false
                });
            }

            if (rows.length <= 0) {
                return resolve({code: 200, exists: false});
            }
            
            resolve({code: 200, exists: true, data: rows[0]});
        });
    });
}

function CreateNewUser(data) {
	return new Promise((resolve, reject) => {
        GetUserData(data)
        .then(user => {
            if (user.exists) {
                return resolve({
                    code: new errors.InvalidArgumentError(), 
                    exists: true
                });
            }

            const qry = "INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
            
            const hashedPassword = generateHash(data.password);
            
            db.pool.query(qry, [data.email, hashedPassword, data.firstname, data.lastname], (err, result) => {
                if (err) {
                    return reject({
                        code: new errors.InternalServerError(),
                    });
                }

                if (result.affectedRows <= 0) {
                    return reject({
                        code: new errors.InternalServerError(),
                    });
                }

                const { firstname, lastname, email, password } = data;
                const id = result.insertId;

                const token = jwt.sign({ id, email, password }, process.env.JWT_SECRET, { expiresIn: '10m' });
                const { iat, exp } = jwt.decode(token);
                
                return resolve({
                    code: 201, 
                    token, 
                    exp, 
                    user: {
                        id,
                        firstname,
                        lastname,
                        email
                    }
                });
            });
        })
        .catch(error => {
            reject({ code: new errors.InternalServerError(), message: error });
        });
    });
}

function LoginAUser(data) {    
    return new Promise((resolve, reject) => {
        GetUserData(data)
        .then(user => {
            if (!user.exists) {
                return reject({
                    code: new errors.UnauthorizedError(), 
                    exists: false 
                });
            }

            if (!validPassword(data.password, user.data.password)) {
                return reject({
                    code: new errors.UnauthorizedError(), 
                    exists: false 
                });
            }

            const token = jwt.sign({ id: user.data.ID, email: data.email, password: user.data.password }, process.env.JWT_SECRET, { expiresIn: '10m' });
            const { iat, exp } = jwt.decode(token);
            
            delete user.data.password;
            resolve({code: 200, token, exp, user: user.data });
        })
        .catch(error => {
            reject({ code: new errors.InternalServerError(), message: error });
        });
    });
}

function generateHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPassword(userPassword, passwordInDB) {
	return bcrypt.compareSync(userPassword, passwordInDB);
}

module.exports = {
    CreateNewUser,
    LoginAUser
};