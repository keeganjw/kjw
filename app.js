const express = require('express');
const handlebars = require('express-handlebars');
const blog = require('./blog');

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', handlebars.engine({
	layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.use('/blog', blog.router);

app.get('/', (req, res) => {
	res.render('index', { title: 'Home' });
});

app.get('/projects', (req, res) => {
	res.render('projects', { title: 'About' });
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
});