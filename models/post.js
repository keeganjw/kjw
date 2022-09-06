const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true,
		lowercase: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	thumbnail: {
		type: String,
	},
	article: {
		type: String,
		required: true
	},
	isPublished: {
		type: Boolean,
		required: true,
		default: false
	},
	dateCreated: {
		type: Date,
		required: true,
		immutable: true,
		default: Date.now
	}
});

module.exports = mongoose.model('Post', postSchema);