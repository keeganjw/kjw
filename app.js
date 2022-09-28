const express = require('express');
const fileUpload = require('express-fileupload');
const flash = require('express-flash');
const hbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const auth = require('./auth');
const admin = require('./routes/admin');
const blog = require('./routes/blog');
const projects = require('./routes/projects');
const secrets = require('./secrets/secrets');
const User = require('./models/user');

// Require .env file if not in production
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect(secrets.connectionString)
.then((result) => console.log('Connected to the MongoDB database.'))
.catch((error) => console.error(error));

// Setup handlebars
app.engine('hbs', hbs.engine({
	extname: 'hbs',
	defaultLayout: 'layout-main',
	layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload());
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

// Configure passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	session: true
}, auth.authenticateUser));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

// Set routes from other files
app.use('/blog', blog.router);
app.use('/projects', projects.router);
app.use('/admin', auth.allowIfAuthenticated, admin.router);

// Set remaining routes
app.get('/', (req, res) => {
	res.render('index', { title: 'Keegan Woodward' });
});

app.get('/about', (req, res) => {
	res.render('about', { title: 'Keegan Woodward' });
});

app.get('/login', (req, res) => {
	res.render('login', { title: 'Login' });
});

app.post('/login', auth.disallowIfAuthenticated, passport.authenticate('local', {
	successRedirect: '/admin',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('/logout', auth.allowIfAuthenticated, (req, res, next) => {
	req.logout((error) => {
		if (error) {
			return next(error);
		}

		res.redirect('/login');
	});
});

app.get('/blocked', (req, res) => {
	res.send('blocked');
});

// Listen for HTTP requests at specified port number
app.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
});