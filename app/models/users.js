var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, select: false },
	first_name: String,
	last_name: String,
	picture: String,
	roles: { type: [String], enum: ['admin', 'coach', 'trainee'] },
	google: String,
	calendars: [String],
	coach: {
		calendlyUrl: String
	}
});

module.exports = mongoose.model('User', userSchema);