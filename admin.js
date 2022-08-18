const express = require('express');
const router = express.Router();
const showdown = require('showdown');
const Post = require('./models/post');

const markdown = new showdown.Converter();

router.get('/', async (req, res) => {
    const posts = await Post.find({ isPublished: true }).lean();
    res.render('blog/list', { title: 'Blog', posts: posts });
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
        post.isPublished = true;
        post = await post.save();
        res.redirect(`/blog/${post.id}`);
    }
    catch (error) {
        console.log(error);
        res.render('admin/new', { title: 'Write New Post', post: post });
    }
});

router.get('/new', (req, res) => {
    res.render('admin/new', { title: 'Write New Post', post: new Post() });
});

router.get('/edit/:slug', (req, res) => {
    res.render('admin/edit');
});

router.get('/preview/:slug', async (req, res) => {
    const slug = req.params.slug;

    try {
        let post = await Post.findOne({ slug: slug }).lean();
        post.article = markdown.makeHtml(post.article);
        post.dateCreated = new Date(post.dateCreated).toDateString();
        res.render('admin/preview', { title: post.title, post: post });
    }
    catch (error) {
        res.send('Blog post not found.');
    }
});

module.exports = {
    router
};