const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const express = require('express');
const fs = require('fs/promises');
const showdown = require('showdown');
const Post = require('../models/post');
const User = require('../models/user');

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
		const post = await Post.findOne({ slug: slug }).lean();
		// TEST, REMOVE LATER
		await fs.writeFile('./public/edit.txt', post.article);
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
		post.dateCreated = dayjs(post.dateCreated).format('MMMM D, YYYY');
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
	// If passwords entered do not match, return to add user page
	if(req.body.password !== req.body.confirmPassword) {
		res.redirect('/admin/add-user');
	}

	try {
		// Hash password, create new user schema object,
		// save to DB, and then redirect to login page
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

router.get('/blog-images', async (req, res) => {
	// Get file names of all files in public/images/uploads
	// Then set each string as the full encoded URI path to the image
	let images = await fs.readdir('./public/images/uploads');
	images.forEach((item, index, images) => images[index] = encodeURI('/images/uploads/' + item));

	res.render('admin/blog-images', { layout: 'layout-admin', images: images, title: 'Upload and Select Blog Images' });
});

router.post('/blog-images', (req, res) => {
	try {
		// If there's an image to upload, try to uploading it to /public/images/uploads
		if (req.files.image) {
			const image = req.files.image;

			// Move uploaded image to ./public/images/uploads folder
			image.mv('./public/images/uploads/' + image.name, (error) => {
				if(error) {
					// Upload failed
					res.send('Upload failed when moving: ' + error);
				}
				else {
					// Upload succeeded
					res.redirect('/admin/blog-images');
				}
			});
		}
		// User clicked submit without uploading an image
		else {
			res.send('No image uploaded');
		}
	}
	catch(error) {
		res.send('Upload failed: ' + error);
	}
});

module.exports = {
	router
};