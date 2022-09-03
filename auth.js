const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

let users = [];

async function addUser(newUser) {
	const hashedPassword = await bcrypt.hash(newUser.password, 10);

	users.push({
		id: Date.now().toString(),
		name: newUser.name,
		email: newUser.email,
		password: hashedPassword
	});
}

async function authenticateUser(email, password, done) {
	// Search for user in user array
	const user = users.find((user) => user.email === email);
	const failedLoginMessage = 'Email or password is incorrect.';

	// If user doesn't exist, return failed login message
	if (!user) {
		return done(null, false, failedLoginMessage);
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
			return done(null, false, failedLoginMessage);
		}
	}
}

function allowIfAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/blocked');
	}
}

function allowIfNotAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/admin');
	}
}

module.exports = {
	addUser,
	authenticateUser,
	allowIfAuthenticated,
	allowIfNotAuthenticated
}