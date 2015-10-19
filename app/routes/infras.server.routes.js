'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var infras = require('../../app/controllers/infras.server.controller');

	// Infras Routes
	app.route('/infras')
		.get(infras.list)
		.post(users.requiresLogin, infras.create);

	app.route('/infras/:infraId')
		.get(infras.read)
		.put(users.requiresLogin, infras.hasAuthorization, infras.update)
		.delete(users.requiresLogin, infras.hasAuthorization, infras.delete);

	// Finish by binding the Infra middleware
	app.param('infraId', infras.infraByID);
};
