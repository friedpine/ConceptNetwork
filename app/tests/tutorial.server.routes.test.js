'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tutorial = mongoose.model('Tutorial'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tutorial;

/**
 * Tutorial routes tests
 */
describe('Tutorial CRUD tests', function() {
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

		// Save a user to the test db and create new Tutorial
		user.save(function() {
			tutorial = {
				name: 'Tutorial Name'
			};

			done();
		});
	});

	it('should be able to save Tutorial instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tutorial
				agent.post('/tutorials')
					.send(tutorial)
					.expect(200)
					.end(function(tutorialSaveErr, tutorialSaveRes) {
						// Handle Tutorial save error
						if (tutorialSaveErr) done(tutorialSaveErr);

						// Get a list of Tutorials
						agent.get('/tutorials')
							.end(function(tutorialsGetErr, tutorialsGetRes) {
								// Handle Tutorial save error
								if (tutorialsGetErr) done(tutorialsGetErr);

								// Get Tutorials list
								var tutorials = tutorialsGetRes.body;

								// Set assertions
								(tutorials[0].user._id).should.equal(userId);
								(tutorials[0].name).should.match('Tutorial Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tutorial instance if not logged in', function(done) {
		agent.post('/tutorials')
			.send(tutorial)
			.expect(401)
			.end(function(tutorialSaveErr, tutorialSaveRes) {
				// Call the assertion callback
				done(tutorialSaveErr);
			});
	});

	it('should not be able to save Tutorial instance if no name is provided', function(done) {
		// Invalidate name field
		tutorial.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tutorial
				agent.post('/tutorials')
					.send(tutorial)
					.expect(400)
					.end(function(tutorialSaveErr, tutorialSaveRes) {
						// Set message assertion
						(tutorialSaveRes.body.message).should.match('Please fill Tutorial name');
						
						// Handle Tutorial save error
						done(tutorialSaveErr);
					});
			});
	});

	it('should be able to update Tutorial instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tutorial
				agent.post('/tutorials')
					.send(tutorial)
					.expect(200)
					.end(function(tutorialSaveErr, tutorialSaveRes) {
						// Handle Tutorial save error
						if (tutorialSaveErr) done(tutorialSaveErr);

						// Update Tutorial name
						tutorial.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tutorial
						agent.put('/tutorials/' + tutorialSaveRes.body._id)
							.send(tutorial)
							.expect(200)
							.end(function(tutorialUpdateErr, tutorialUpdateRes) {
								// Handle Tutorial update error
								if (tutorialUpdateErr) done(tutorialUpdateErr);

								// Set assertions
								(tutorialUpdateRes.body._id).should.equal(tutorialSaveRes.body._id);
								(tutorialUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tutorials if not signed in', function(done) {
		// Create new Tutorial model instance
		var tutorialObj = new Tutorial(tutorial);

		// Save the Tutorial
		tutorialObj.save(function() {
			// Request Tutorials
			request(app).get('/tutorials')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tutorial if not signed in', function(done) {
		// Create new Tutorial model instance
		var tutorialObj = new Tutorial(tutorial);

		// Save the Tutorial
		tutorialObj.save(function() {
			request(app).get('/tutorials/' + tutorialObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tutorial.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tutorial instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tutorial
				agent.post('/tutorials')
					.send(tutorial)
					.expect(200)
					.end(function(tutorialSaveErr, tutorialSaveRes) {
						// Handle Tutorial save error
						if (tutorialSaveErr) done(tutorialSaveErr);

						// Delete existing Tutorial
						agent.delete('/tutorials/' + tutorialSaveRes.body._id)
							.send(tutorial)
							.expect(200)
							.end(function(tutorialDeleteErr, tutorialDeleteRes) {
								// Handle Tutorial error error
								if (tutorialDeleteErr) done(tutorialDeleteErr);

								// Set assertions
								(tutorialDeleteRes.body._id).should.equal(tutorialSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tutorial instance if not signed in', function(done) {
		// Set Tutorial user 
		tutorial.user = user;

		// Create new Tutorial model instance
		var tutorialObj = new Tutorial(tutorial);

		// Save the Tutorial
		tutorialObj.save(function() {
			// Try deleting Tutorial
			request(app).delete('/tutorials/' + tutorialObj._id)
			.expect(401)
			.end(function(tutorialDeleteErr, tutorialDeleteRes) {
				// Set message assertion
				(tutorialDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tutorial error error
				done(tutorialDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tutorial.remove().exec();
		done();
	});
});