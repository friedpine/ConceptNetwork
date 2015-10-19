'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */

var compSchema = new Schema({ name: 'string', ttype: 'string', tdata: 'string'});
var pageSchema = new Schema({ unitname: 'string', pagename: 'string', page: [compSchema]});

var sampleSchema = new Schema({ name:'string', species:'string', sampleSource:'string', tags:'string'});
var fileSchema = new Schema({sample: 'string', filetag: 'string', path: 'string', method: 'string'});

var ProjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project name',
		trim: true
	},
	
	frames: [pageSchema],

	frames_order : {"unit" : ["string"]},

	
	created: {
		type: Date,
		default: Date.now
	},
	
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	
	samples: [sampleSchema],

	files: [fileSchema]
});

mongoose.model('Project', ProjectSchema);