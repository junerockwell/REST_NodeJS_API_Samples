let mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	register_date: {
		type: Date,
		default: Date.now,
		required: true
	}
});

/* Methods
 ============================================= */
UserSchema.methods.generateHash = password => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = password => {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);





