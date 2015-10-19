'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Infra = mongoose.model('Infra'),
	_ = require('lodash');

/**
 * Create a Infra
 */
exports.create = function(req, res) {
	var infra = new Infra(req.body);
	infra.user = req.user;

	infra.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(infra);
		}
	});
};

/**
 * Show the current Infra
 */
exports.read = function(req, res) {
	res.jsonp(req.infra);
};

/**
 * Update a Infra
 */
exports.update = function(req, res) {
	var infra = req.infra ;

	infra = _.extend(infra , req.body);

	infra.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(infra);
		}
	});
};

/**
 * Delete an Infra
 */
exports.delete = function(req, res) {
	var infra = req.infra ;

	infra.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(infra);
		}
	});
};

/**
 * List of Infras
 */
exports.list = function(req, res) { 
	Infra.find().sort('-created').populate('user', 'displayName').exec(function(err, infras) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(infras);
		}
	});
};


/**
 * Infra middleware
 */
exports.infraByID = function(req, res, next, id) { 
	Infra.findById(id).populate('user', 'displayName').exec(function(err, infra) {
		if (err) return next(err);
		if (! infra) return next(new Error('Failed to load Infra ' + id));
		req.infra = infra ;
		next();
	});
};

/**
 * Infra authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.infra.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
