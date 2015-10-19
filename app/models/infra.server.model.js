'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Infra Schema
 */
var InfraSchema = new Schema({
	config_type: {
		type: String,
		default: '',
		required: 'Please fill Scope name',
		trim: true
	},
	config_title: {
		type: String,
		default: '',
		required: 'Please fill Subject name',
		trim: true
	},
	detailed: {
		type: String,
		default: '',
		required: 'Please fill Detailed Information!',
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

mongoose.model('Infra', InfraSchema);