'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tutorials = require('../../app/controllers/tutorials.server.controller');

	// Tutorials Routes
	app.route('/tutorials')
		.get(tutorials.list)
		.post(users.requiresLogin, tutorials.create);

	app.route('/tutorials/:tutorialId')
		.get(tutorials.read)
		.put(users.requiresLogin, tutorials.hasAuthorization, tutorials.update)
		.delete(users.requiresLogin, tutorials.hasAuthorization, tutorials.delete);

	// Finish by binding the Tutorial middleware
	app.param('tutorialId', tutorials.tutorialByID);
};
