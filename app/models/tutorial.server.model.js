'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tutorial Schema
 */
var TutorialSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tutorial name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tutorial', TutorialSchema);