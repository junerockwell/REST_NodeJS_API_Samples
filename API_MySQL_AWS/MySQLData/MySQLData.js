let mysql = require('mysql');
let config = require('../config/db.js');
let bcrypt = require('bcrypt-nodejs');

let pool = mysql.createPool(config.db);

module.exports = {
	UsernameExists: data => {
		return new Promise((resolve, reject) => {
			let qry = "SELECT * FROM users WHERE username = ?";
			pool.query(qry, [data.username], (err, rows) => {
				if (err) {
					return reject(err, { exists: false });
				}

				if (rows.length <= 0) {
					return resolve(null, { exists: false });
				}

				resolve(null, { exists: true, password: rows[0].password });
			});
		});
	},
	LoginAUser: data => {
		return new Promise((resolve, reject) => {
			let qry = "SELECT * FROM users WHERE username = ?";

			pool.query(qry, [data.email], (err, rows) => {
				if (err) {
					return reject(err, { exists: false, success: false });
				}

				if (rows.length <= 0) {
					return resolve(null, { exists: false, success: false });
				}

				if (!validPassword(data.password)) {
					resolve(null, { exists: true, success: false });
					return;
				}

				if (!validPassword(rows[0].password, data.password)) {
					resolve(null, { exists: true, success: false });
					return;
				}

				resolve(null, { exists: true, success: true, userId: rows[0].id });
			});
			return this.UsernameExists(data)
			.then((err1, userName) => {
				if (err1) {
					return reject(err1, { success: false, exists: false });
				}

				if (!userName) {
					return resolve(null, { success: false, exists: false });
				}


				if (!validPassword(data.password, userName.password)) {
					return resolve(null, { success: false, exists: true });
				}

				return resolve(null, { success: true, exists: true, userId: userName.id });
			})
		});
	},
	SignUp: data => {
		return new Promise((resolve, reject) => {
			// find if user exists first
			// if user exists, return that data
			// else if user doesn't exist, do insert query
			return this.UsernameExists(data)
			.then((err1, userName) => {
				if (err1) {
					return reject(err1, { success: false });
				}

				if (userName) {
					return resolve(null, { success: false });
				}

				return;
			})
			.then(() => {
				let qry = "INSERT INTO users (username, password) VALUES (?, ?)";
				let hashedPassword = generateHash(data.password);
				pool.query(qry, [data.username, hashedPassword], (err2, result) => {
					if (err2) {
						return reject(err2, { success: false });
					}

					if (result.affectedRows > 0) {
						return resolve(null, { success: true, userId: result.insertId });
					} else {
						return resolve(null, { success: false, userId: 0 });
					}
				});
			});
		});
	}
};

generateHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

validPassword(userPassword, passwordInDB) {
	return bcrypt.compareSync(userPassword, passwordInDB);
}

