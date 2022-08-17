const express = require('express');
const router = express.Router();
const showdown = require('showdown');
const Post = require('./models/post');
const fs = require('fs');
const path = require('path');

const markdown = new showdown.Converter();
const posts = [
	{
		title: 'Post 1',
		dateCreated: '3/12/2020',
		lede: '',
		content: 'Nunc id cursus metus aliquam. Risus quis varius quam quisque id diam.'
	},
	{
		title: 'Post 2',
		dateCreated: '5/6/2020',
		lede: '',
		content: 'Lectus quam id leo in vitae. Fermentum dui faucibus in ornare quam.'
	},
	{
		title: 'Post 3',
		dateCreated: '10/17/2020',
		lede: '',
		content: 'Placerat in egestas erat imperdiet. Consectetur libero id faucibus nisl tincidunt eget.'
	},
];

router.get('/', (req, res) => {
	res.render('blog/list', { title: 'Blog', posts: posts });
});

router.post('/new', async (req, res) => {
	let post = new Post({
		title: req.body.title,
		slug: 'asdf',
		lede: 'asdf',
		content: req.body.content,
	});

	try {
		post = await post.save();
		res.redirect(`blog/${post.id}`);
	}
	catch (error) {
		console.log(error);
		res.render('blog/new', { title: 'Write New Post', post: post });
	}
});

router.get('/new', (req, res) => {
	res.render('blog/new', { title: 'Write New Post', post: new Post() });
});

router.get('/test-md', (req, res) => {
	const md = fs.readFileSync(path.resolve(__dirname, 'markdown/test.md'), 'utf8');
	const html = markdown.makeHtml(md);
	res.render('blog/post', { title: 'Markdown Test', dateCreated: '1/1/2000', content: html });
});

router.get('/:post/edit', (req, res) => {
	res.render('blog/edit');
});

router.get('/:post', (req, res) => {
	const id = req.params.post;
	if(id >= 0 && id < posts.length) {
		let post = posts[id];
		post.content = markdown.makeHtml(post.content);
		res.render('blog/post', post);
	}
	else {
		res.status(400);
	}
});

module.exports = {
	router
};