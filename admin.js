const express = require('express');
const router = express.Router();
const showdown = require('showdown');
const Post = require('./models/post');

const markdown = new showdown.Converter();

router.get('/', async (req, res) => {
	res.render('admin/index', { layout: 'ly-admin', title: 'Dashboard' });
});

router.get('/published', async (req, res) => {
	const posts = await Post.find({ isPublished: true }).lean();
	res.render('admin/list', { layout: 'ly-admin', title: 'Published Posts', posts: posts });
});

router.get('/drafts', async (req, res) => {
	const posts = await Post.find({ isPublished: false }).lean();
	res.render('admin/list', { layout: 'ly-admin', title: 'Drafts', posts: posts });
});

router.post('/new', async (req, res) => {
	let post = new Post({
		title: req.body.title,
		author: req.body.author,
		slug: req.body.slug,
		description: req.body.description,
		article: req.body.article
	});

	try {
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
		res.render('admin/new', { layout: 'ly-admin', title: 'Write New Post', post: post });
	}
});

router.get('/new', (req, res) => {
	res.render('admin/new', { layout: 'ly-admin', title: 'Write New Post', post: new Post() });
});

router.get('/edit/:slug', async (req, res) => {
	const slug = req.params.slug;

	try {
		let post = await Post.findOne({ slug: slug }).lean();
		res.render('admin/edit', { layout: 'ly-admin', title: post.title, post: post });
	}
	catch (error) {
		res.send('Blog post not found for editing.');
	}
});

router.post('/edit/:slug', async (req, res) => {
	const slug = req.params.slug;
	let update = {
		title: req.body.title,
		author: req.body.author,
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
		res.render('admin/preview', { layout: 'ly-admin', title: post.title, post: post });
	}
	catch (error) {
		res.send('Blog post not found.');
	}
});

module.exports = {
	router
};