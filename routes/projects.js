const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
	res.render('projects/index', { title: 'kjw.dev' });
});

router.get('/kjw', async (req, res) => {
	res.render('projects/kjw', { title: 'kjw.dev' });
});

router.get('/passport-app', async (req, res) => {
	res.render('projects/passport-app', { title: 'Passport App' });
});

router.get('/work-orders', async (req, res) => {
	res.render('projects/work-orders', { title: 'Work Orders' });
});

module.exports = {
	router
};