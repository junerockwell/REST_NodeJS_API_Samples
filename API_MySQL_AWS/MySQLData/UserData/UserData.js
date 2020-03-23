let mysql = require('mysql');
let config = require('../../config/db.js');
let bcrypt = require('bcrypt-nodejs');

let pool = mysql.createPool(config.db);

let UserData = {
	GetUserData: data => {
		return new Promise((resolve, reject) => {
			let qry = "SELECT * FROM users WHERE username = ?";
			pool.query(qry, [data.username], (err, rows) => {
				if (err) {
					return reject({error: err, exists: false});
				}

				if (rows.length <= 0) {
					return resolve({error: null, exists: false});
				}

				resolve({error: null, exists: true, data: rows[0]});
			});
		});
	},
	LoginAUser: data => {
		return new Promise((resolve, reject) => {
			UserData.GetUserData(data)
			.then(user => {
				if (user.error) {
					return reject({error: err1, success: false, exists: false});
				}

				if (!user.exists) {
					return resolve({error: null, success: false, exists: false });
				}


				if (!validPassword(data.password, user.data.password)) {
					// console.log('invalid password');
					return resolve({error: null, success: false, exists: true});
				}

				resolve({error: null, success: true, exists: true, userId: user.data.id});
			})
		});
	},
	SignUp: data => {
		return new Promise((resolve, reject) => {
			UserData.GetUserData(data)
			.then(user => {
				if (user.error) {
					return reject({ error: user.error, success: false});
				}

				if (user.exists) {
					return resolve({error: null, success: false, exists: true});
				}

				let qry = "INSERT INTO users (username, password) VALUES (?, ?)";
				let hashedPassword = generateHash(data.password);
				pool.query(qry, [data.username, hashedPassword], (err2, result) => {
					if (err2) {
						return reject({error: err2, success: false });
					}

					if (result.affectedRows > 0) {
						return resolve({error: null, success: true, userId: result.insertId });
					} else {
						return resolve({error: null, success: false, userId: 0 });
					}
				});
			});
		});
	}
};

function generateHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPassword(userPassword, passwordInDB) {
	return bcrypt.compareSync(userPassword, passwordInDB);
}

module.exports = UserData;

