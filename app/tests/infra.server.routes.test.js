'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Infra = mongoose.model('Infra'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, infra;

/**
 * Infra routes tests
 */
describe('Infra CRUD tests', function() {
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

		// Save a user to the test db and create new Infra
		user.save(function() {
			infra = {
				name: 'Infra Name'
			};

			done();
		});
	});

	it('should be able to save Infra instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Infra
				agent.post('/infras')
					.send(infra)
					.expect(200)
					.end(function(infraSaveErr, infraSaveRes) {
						// Handle Infra save error
						if (infraSaveErr) done(infraSaveErr);

						// Get a list of Infras
						agent.get('/infras')
							.end(function(infrasGetErr, infrasGetRes) {
								// Handle Infra save error
								if (infrasGetErr) done(infrasGetErr);

								// Get Infras list
								var infras = infrasGetRes.body;

								// Set assertions
								(infras[0].user._id).should.equal(userId);
								(infras[0].name).should.match('Infra Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Infra instance if not logged in', function(done) {
		agent.post('/infras')
			.send(infra)
			.expect(401)
			.end(function(infraSaveErr, infraSaveRes) {
				// Call the assertion callback
				done(infraSaveErr);
			});
	});

	it('should not be able to save Infra instance if no name is provided', function(done) {
		// Invalidate name field
		infra.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Infra
				agent.post('/infras')
					.send(infra)
					.expect(400)
					.end(function(infraSaveErr, infraSaveRes) {
						// Set message assertion
						(infraSaveRes.body.message).should.match('Please fill Infra name');
						
						// Handle Infra save error
						done(infraSaveErr);
					});
			});
	});

	it('should be able to update Infra instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Infra
				agent.post('/infras')
					.send(infra)
					.expect(200)
					.end(function(infraSaveErr, infraSaveRes) {
						// Handle Infra save error
						if (infraSaveErr) done(infraSaveErr);

						// Update Infra name
						infra.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Infra
						agent.put('/infras/' + infraSaveRes.body._id)
							.send(infra)
							.expect(200)
							.end(function(infraUpdateErr, infraUpdateRes) {
								// Handle Infra update error
								if (infraUpdateErr) done(infraUpdateErr);

								// Set assertions
								(infraUpdateRes.body._id).should.equal(infraSaveRes.body._id);
								(infraUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Infras if not signed in', function(done) {
		// Create new Infra model instance
		var infraObj = new Infra(infra);

		// Save the Infra
		infraObj.save(function() {
			// Request Infras
			request(app).get('/infras')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Infra if not signed in', function(done) {
		// Create new Infra model instance
		var infraObj = new Infra(infra);

		// Save the Infra
		infraObj.save(function() {
			request(app).get('/infras/' + infraObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', infra.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Infra instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Infra
				agent.post('/infras')
					.send(infra)
					.expect(200)
					.end(function(infraSaveErr, infraSaveRes) {
						// Handle Infra save error
						if (infraSaveErr) done(infraSaveErr);

						// Delete existing Infra
						agent.delete('/infras/' + infraSaveRes.body._id)
							.send(infra)
							.expect(200)
							.end(function(infraDeleteErr, infraDeleteRes) {
								// Handle Infra error error
								if (infraDeleteErr) done(infraDeleteErr);

								// Set assertions
								(infraDeleteRes.body._id).should.equal(infraSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Infra instance if not signed in', function(done) {
		// Set Infra user 
		infra.user = user;

		// Create new Infra model instance
		var infraObj = new Infra(infra);

		// Save the Infra
		infraObj.save(function() {
			// Try deleting Infra
			request(app).delete('/infras/' + infraObj._id)
			.expect(401)
			.end(function(infraDeleteErr, infraDeleteRes) {
				// Set message assertion
				(infraDeleteRes.body.message).should.match('User is not logged in');

				// Handle Infra error error
				done(infraDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Infra.remove().exec();
		done();
	});
});