const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: Date,
		required: true,
		immutable: true,
		default: Date.now
	}
});

module.exports = mongoose.model('Message', messageSchema);