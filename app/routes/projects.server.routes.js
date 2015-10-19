'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');

	// Projects Routes
	app.route('/projects')
		.get(projects.list)
		.post(users.requiresLogin, projects.create);

	app.route('/projects/:projectId')
		.get(projects.read)
		.put(users.requiresLogin, projects.hasAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

	app.route('/projects/:projectId/:subname')
		.get(projects.get_subArray)
		.post(users.requiresLogin, projects.hasAuthorization, projects.pushSubArray);

	app.route('/projects/:projectId/:subname/:subID')
		.get(projects.get_subDoc);

	// Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
