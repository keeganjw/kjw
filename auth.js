const bcrypt = require('bcrypt');
const User = require('./models/user');

async function authenticateUser(email, password, done) {
	// Search for user in user array
	const user = await User.findOne({ email: email }).lean();
	const failedLoginMessage = 'Email or password is incorrect.';

	// If user doesn't exist, return failed login message
	if (!user) {
		return done(null, false, 'User not found.');
	}
	else {
		// Check if passwords match
		const passwordsMatch = await bcrypt.compare(password, user.password);

		// If passwords match, authenticate user
		if (passwordsMatch) {
			return done(null, user);
		}
		// If password doesn't match, return failed login message
		else {
			return done(null, false, 'Password incorrect.');
		}
	}
}

function allowIfAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.sendStatus(404);
	}
}

function disallowIfAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/admin');
	}
}

module.exports = {
	authenticateUser,
	allowIfAuthenticated,
	disallowIfAuthenticated
}