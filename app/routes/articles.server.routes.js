'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var articles = require('../../app/controllers/articles.server.controller');

	// Articles Routes
	app.route('/articles')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	// Finish by binding the Article middleware
	app.param('articleId', articles.articleByID);
};
