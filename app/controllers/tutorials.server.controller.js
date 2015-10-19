'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tutorial = mongoose.model('Tutorial'),
	_ = require('lodash');

/**
 * Create a Tutorial
 */
exports.create = function(req, res) {
	var tutorial = new Tutorial(req.body);
	tutorial.user = req.user;

	tutorial.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tutorial);
		}
	});
};

/**
 * Show the current Tutorial
 */
exports.read = function(req, res) {
	res.jsonp(req.tutorial);
};

/**
 * Update a Tutorial
 */
exports.update = function(req, res) {
	var tutorial = req.tutorial ;

	tutorial = _.extend(tutorial , req.body);

	tutorial.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tutorial);
		}
	});
};

/**
 * Delete an Tutorial
 */
exports.delete = function(req, res) {
	var tutorial = req.tutorial ;

	tutorial.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tutorial);
		}
	});
};

/**
 * List of Tutorials
 */
exports.list = function(req, res) { 
	Tutorial.find().sort('-created').populate('user', 'displayName').exec(function(err, tutorials) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tutorials);
		}
	});
};

/**
 * Tutorial middleware
 */
exports.tutorialByID = function(req, res, next, id) { 
	Tutorial.findById(id).populate('user', 'displayName').exec(function(err, tutorial) {
		if (err) return next(err);
		if (! tutorial) return next(new Error('Failed to load Tutorial ' + id));
		req.tutorial = tutorial ;
		next();
	});
};

/**
 * Tutorial authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tutorial.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
