let config = require('../config/db.js');
let tediousPromise = require('tedious-promises');
let ConnectionPool = require('tedious-connection-pool');
let pool = new ConnectionPool(config.pool, config.connect);
tediousPromise.setConnectionPool(pool);
let bcrypt = require('bcrypt-nodejs');
let TYPES = require('tedious').TYPES;

let UserData = {
	
	GetUserData: data => {
		
		let qry = "SELECT * FROM users WHERE username = @username";
		return tediousPromise.sql(qry)
		.parameter('username', TYPES.VarChar, data.username)
		.execute()
		.then(results => {
			if (results.length > 0) {
				return {error: null, data: results[0], exists: true};
			}
			return {error: null, data: {}, exists: false};
		})
		.fail(err => {
			return {error: err, data: {}, exists: false};
		});
	},
	SignUp: data => {
		return UserData.GetUserData(data)
		.then(user => {
			
			if (user.error) {
				return {error: user.error, exists: false, success: false};
			}

			if (user.exists === true) {
				return {error: null, exists: true, success: false};
			}
			
			let hasedPassword = generateHash(data.password);
			let qry = "INSERT INTO users (username, password) OUTPUT INSERTED.Id VALUES (@username, @password)";
			return tediousPromise.sql(qry)
			.parameter('username', TYPES.VarChar, data.username)
			.parameter('password', TYPES.VarChar, hasedPassword)
			.execute()
			.then(result => {
				return {error: null, data: result};
			})
			.fail(err => {
				return {error: err, data: {}};
			});
		});
	},
	LoginAUser: data => {
		return UserData.GetUserData(data)
		.then(user => {
			if (user.error) {
				return {error: user.error, success: false, exists: false};
			}

			if (!user || user.exists === false) {
				return {error: null, success: false, exists: false};
			}

			if (user.data.password && !validPassword(data.password, user.data.password)) {
				return {error: null, success: false, exists: true};
			}
			
			return {error: null, success: true, exists: true, userId: user.data.id};
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