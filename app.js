// Import required packages and files
const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const blog = require('./blog');
const admin = require('./admin');
const secrets = require('./secrets/secrets');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect(secrets.connectionString)
.then((result) => console.log('Connected to the MongoDB database.'))
.catch((error) => console.error(error));

// Set view engine
app.engine('hbs', hbs.engine({
	extname: 'hbs',
	layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/blog', blog.router);
app.use('/admin', admin.router);

// Set non-blog routes
app.get('/', (req, res) => {
	res.render('index', { title: 'Home' });
});
app.get('/projects', (req, res) => {
	res.render('projects', { title: 'About' });
});

// Listen for HTTP requests at specified port number
app.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
});