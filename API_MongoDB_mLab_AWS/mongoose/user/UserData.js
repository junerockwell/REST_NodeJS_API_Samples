var User = require('./UserModel');

module.exports = {
	LoginAUser: (data) => {
		return new Promise((resolve, reject) => {
			User.findOne({ 'username': data.username }, (err, user) => {
				if (err) {
					reject(err, {});
					return;
				}

				if (!user) {
					resolve(null, { exists: false, success: false });
					return;
				}

				if (!user.validPassword(data.password)) {
					resolve(null, { exists: true, success: false });
					return;
				}

				resolve(null, { exists: true, success: true, user: user });
			});
		});
	},
	SignUp: data => {
		return new Promise((resolve, reject) => {
			User.findOne({ 'username': data.username }, (err, user) => {
				if (err) {
					reject(err, {});
					return;
				}

				if (user) {
					resolve(null, { exists: true });
					return;
				}

				let newUser = new User();
				newUser.username = data.username;
				newUser.firstname = data.firstname;
				newUser.lastname = data.lastname;
				newUser.password = newUser.generateHash(data.password);

				newUser.save((err2, _newUser) => {
					if (err2) {
						reject(err2, {});
						return;
					}

					return resolve(null, { userId: _newUser._id });
				});
			});
		});
	}
};









