const express = require('express');
const router = express.Router();
const showdown = require('showdown');
const Post = require('../models/post');

const markdown = new showdown.Converter();

router.get('/', async (req, res) => {
	const posts = await Post.find({ isPublished: true }).lean();
	res.render('blog/list', { title: 'Blog', posts: posts });
});

router.get('/:slug', async (req, res) => {
	const slug = req.params.slug;
	
	try {
		let post = await Post.findOne({ slug: slug }).lean();
		post.article = markdown.makeHtml(post.article);
		post.dateCreated = new Date(post.dateCreated).toDateString();
		res.render('blog/post', { title: post.title, post: post });
	}
	catch(error) {
		res.send('Blog post not found.');
	}
});

module.exports = {
	router
};