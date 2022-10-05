const express = require('express');
const passport = require('passport');

const auth = require('../auth');
const Message = require('../models/message');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { title: 'Keegan Woodward' });
});

router.get('/about', (req, res) => {
	res.render('about', { title: 'About' });
});

router.get('/contact', (req, res) => {
	res.render('contact', { title: 'Contact' });
});

router.post('/contact', async (req, res) => {
	try {
		const message = new Message({
			name: req.body.name,
			email: req.body.email,
			message: req.body.message
		});

		await message.save();
	}
	catch(error) {
		console.log(error);
	}

	res.redirect('contact');
});

router.get('/resume', (req, res) => {
	res.render('resume', { title: 'Resume' });
});

router.get('/login', (req, res) => {
	res.render('login', { title: 'Login' });
});

router.post('/login', auth.redirectIfAuthenticated, passport.authenticate('local', {
	successRedirect: '/admin',
	failureRedirect: '/login',
	failureFlash: true
}));

router.get('/logout', auth.allowIfAuthenticated, (req, res, next) => {
	req.logout((error) => {
		if (error) {
			return next(error);
		}

		res.redirect('/login');
	});
});

router.get('/blocked', (req, res) => {
	res.send('blocked');
});

module.exports = {
	router
};