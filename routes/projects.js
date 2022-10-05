const express = require('express');

const router = express.Router();

router.get('/kjw', (req, res) => {
	res.render('projects/kjw', { title: 'kjw.dev' });
});

router.get('/passport-app', (req, res) => {
	res.render('projects/passport-app', { title: 'Passport App' });
});

router.get('/work-orders', (req, res) => {
	res.render('projects/work-orders', { title: 'Work Orders' });
});

module.exports = {
	router
};