'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Article = mongoose.model('Article'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, article;

/**
 * Article routes tests
 */
describe('Article CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Article
		user.save(function() {
			article = {
				name: 'Article Name'
			};

			done();
		});
	});

	it('should be able to save Article instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Article
				agent.post('/articles')
					.send(article)
					.expect(200)
					.end(function(articleSaveErr, articleSaveRes) {
						// Handle Article save error
						if (articleSaveErr) done(articleSaveErr);

						// Get a list of Articles
						agent.get('/articles')
							.end(function(articlesGetErr, articlesGetRes) {
								// Handle Article save error
								if (articlesGetErr) done(articlesGetErr);

								// Get Articles list
								var articles = articlesGetRes.body;

								// Set assertions
								(articles[0].user._id).should.equal(userId);
								(articles[0].name).should.match('Article Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Article instance if not logged in', function(done) {
		agent.post('/articles')
			.send(article)
			.expect(401)
			.end(function(articleSaveErr, articleSaveRes) {
				// Call the assertion callback
				done(articleSaveErr);
			});
	});

	it('should not be able to save Article instance if no name is provided', function(done) {
		// Invalidate name field
		article.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Article
				agent.post('/articles')
					.send(article)
					.expect(400)
					.end(function(articleSaveErr, articleSaveRes) {
						// Set message assertion
						(articleSaveRes.body.message).should.match('Please fill Article name');
						
						// Handle Article save error
						done(articleSaveErr);
					});
			});
	});

	it('should be able to update Article instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Article
				agent.post('/articles')
					.send(article)
					.expect(200)
					.end(function(articleSaveErr, articleSaveRes) {
						// Handle Article save error
						if (articleSaveErr) done(articleSaveErr);

						// Update Article name
						article.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Article
						agent.put('/articles/' + articleSaveRes.body._id)
							.send(article)
							.expect(200)
							.end(function(articleUpdateErr, articleUpdateRes) {
								// Handle Article update error
								if (articleUpdateErr) done(articleUpdateErr);

								// Set assertions
								(articleUpdateRes.body._id).should.equal(articleSaveRes.body._id);
								(articleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Articles if not signed in', function(done) {
		// Create new Article model instance
		var articleObj = new Article(article);

		// Save the Article
		articleObj.save(function() {
			// Request Articles
			request(app).get('/articles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Article if not signed in', function(done) {
		// Create new Article model instance
		var articleObj = new Article(article);

		// Save the Article
		articleObj.save(function() {
			request(app).get('/articles/' + articleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', article.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Article instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Article
				agent.post('/articles')
					.send(article)
					.expect(200)
					.end(function(articleSaveErr, articleSaveRes) {
						// Handle Article save error
						if (articleSaveErr) done(articleSaveErr);

						// Delete existing Article
						agent.delete('/articles/' + articleSaveRes.body._id)
							.send(article)
							.expect(200)
							.end(function(articleDeleteErr, articleDeleteRes) {
								// Handle Article error error
								if (articleDeleteErr) done(articleDeleteErr);

								// Set assertions
								(articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Article instance if not signed in', function(done) {
		// Set Article user 
		article.user = user;

		// Create new Article model instance
		var articleObj = new Article(article);

		// Save the Article
		articleObj.save(function() {
			// Try deleting Article
			request(app).delete('/articles/' + articleObj._id)
			.expect(401)
			.end(function(articleDeleteErr, articleDeleteRes) {
				// Set message assertion
				(articleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Article error error
				done(articleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Article.remove().exec();
		done();
	});
});