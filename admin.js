const bcrypt = require('bcrypt');
const express = require('express');
const fileupload = require('express-fileupload');
const showdown = require('showdown');
const Post = require('./models/post');
const User = require('./models/user');

const router = express.Router();
const markdown = new showdown.Converter();

router.get('/', async (req, res) => {
	res.render('admin/index', { layout: 'layout-admin', title: 'Dashboard' });
});

router.get('/published', async (req, res) => {
	const posts = await Post.find({ isPublished: true }).lean();
	res.render('admin/list', { layout: 'layout-admin', title: 'Published Posts', posts: posts });
});

router.get('/drafts', async (req, res) => {
	const posts = await Post.find({ isPublished: false }).lean();
	res.render('admin/list', { layout: 'layout-admin', title: 'Drafts', posts: posts });
});

router.get('/new', (req, res) => {
	res.render('admin/new', { layout: 'layout-admin', title: 'Write New Post', post: new Post() });
});

router.post('/new', async (req, res) => {
	try {
		if(req.files.images) {
			let images = req.files.images;
			// Give each image a randomly generated 11-digit alpha-numeric name
			images.forEach((image) => image.name = Math.random().toString(36).slice(2));
		}

		let post = new Post({
			title: req.body.title,
			author: req.user.name,
			slug: req.body.slug,
			description: req.body.description,
			article: req.body.article
		});

		post.isPublished = req.body.submit === 'publish' ? true : false;
		post = await post.save();
		
		if(post.isPublished) {
			res.redirect(`/blog/${post.slug}`);
		}
		else {
			res.redirect(`/admin/preview/${post.slug}`);
		}
	}
	catch (error) {
		console.log(error);
		res.render('admin/new', { layout: 'layout-admin', title: 'Write New Post', post: post });
	}
});

router.get('/edit/:slug', async (req, res) => {
	const slug = req.params.slug;

	try {
		let post = await Post.findOne({ slug: slug }).lean();
		res.render('admin/edit', { layout: 'layout-admin', title: post.title, post: post });
	}
	catch (error) {
		res.send('Blog post not found for editing.');
	}
});

router.post('/edit/:slug', async (req, res) => {
	const slug = req.params.slug;
	let update = {
		title: req.body.title,
		author: req.user.name,
		slug: req.body.slug,
		description: req.body.description,
		article: req.body.article
	}

	// TODO: Change isPublished status here

	try {
		let post = await Post.findOneAndUpdate({ slug: slug }, update, { returnOriginal: false }).lean();
		res.redirect(`/admin/preview/${post.slug}`);
	}
	catch (error) {
		res.send('Blog post not found for editing.');
	}
});

router.get('/preview/:slug', async (req, res) => {
	const slug = req.params.slug;

	try {
		let post = await Post.findOne({ slug: slug }).lean();
		post.article = markdown.makeHtml(post.article);
		post.dateCreated = new Date(post.dateCreated).toDateString();
		res.render('admin/preview', { layout: 'layout-admin', title: post.title, post: post });
	}
	catch (error) {
		res.send('Blog post not found.');
	}
});

router.get('/add-user', (req, res) => {
	res.render('admin/add-user', { layout: 'layout-admin', title: 'Login' });
});

router.post('/add-user', async (req, res) => {
	if(req.body.password !== req.body.confirmPassword) {
		res.redirect('/admin/add-user');
	}

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		let user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		});

		user = await user.save();

		res.redirect('/login');
	}
	catch(error) {
		console.log(error);
		res.redirect('/admin/add-user');
	}
});

module.exports = {
	router
};