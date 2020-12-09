const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
	firstname: {
		type: String,
        required: true,
        trim: true,
	},
	lastname: {
		type: String,
        required: true,
        trim: true,
	},
	email: {
		type: String,
        required: true,
        trim: true,
	},
	password: {
		type: String,
		required: true
	},
});

/* Plugins
 ============================================= */
UserSchema.plugin(timestamp);

/* Methods
 ============================================= */
UserSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = (givenPassword, userPassword) => {
	return bcrypt.compareSync(givenPassword, userPassword);
};

module.exports = mongoose.model('User', UserSchema);





