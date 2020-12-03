const User = require('./UserModel');
const errors = require('restify-errors');
const jwt = require('jsonwebtoken');

async function UserExists(data) {
	try {
		const user = await User.findOne({ email: data.email }).exec();
		return user ? true : false;
	} catch (error) {
		global.logger.error(error);
		return false;
	}
}

async function CreateNewUser(data) {
	const exists = await UserExists(data);
	if (exists) {
		return new errors.InvalidArgumentError();
	}
	else {
		const { firstname, lastname, email, password } = data;

		const user = new User({
			firstname,
			lastname,
			email,
			password
		});
	
		const hash = user.generateHash(password);
		user.password = hash;

		try {
			const newUser = await user.save();
			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '10m' });
			const { iat, exp } = jwt.decode(token);
			return {
				code: 201,
				message: '',
				token,
				iat,
				exp,
				user: newUser
			};
		}
		catch (error) {
			global.logger.error(error);
			return { code: new errors.InternalError(error.message) };
		}
	}
}

async function LoginAUser(data) {
	try {
		const user = await User.findOne({ email: data.email }).exec();

		if (!user || !user.validPassword(data.password, user.password)) {
			return { code: new errors.UnauthorizedError() };
		}

		const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '10m' });
		const { iat, exp } = jwt.decode(token);
	
		return {
			code: 200,
			message: '',
			token,
			iat,
			exp,
			user,
		}

	} catch (error) {
		global.logger.error(error);
		return { code: new errors.InternalServerError() };
	}
}

module.exports = {
	LoginAUser,
	UserExists,
	CreateNewUser,
};









