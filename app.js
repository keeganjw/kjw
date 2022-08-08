// Import require libraries
const express = require('express');
const handlebars = require('express-handlebars');
const blog = require('./blog');

const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.engine('handlebars', handlebars.engine({
	layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/blog', blog.router);

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