'use strict';

(function() {
	// Tutorials Controller Spec
	describe('Tutorials Controller Tests', function() {
		// Initialize global variables
		var TutorialsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Tutorials controller.
			TutorialsController = $controller('TutorialsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tutorial object fetched from XHR', inject(function(Tutorials) {
			// Create sample Tutorial using the Tutorials service
			var sampleTutorial = new Tutorials({
				name: 'New Tutorial'
			});

			// Create a sample Tutorials array that includes the new Tutorial
			var sampleTutorials = [sampleTutorial];

			// Set GET response
			$httpBackend.expectGET('tutorials').respond(sampleTutorials);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tutorials).toEqualData(sampleTutorials);
		}));

		it('$scope.findOne() should create an array with one Tutorial object fetched from XHR using a tutorialId URL parameter', inject(function(Tutorials) {
			// Define a sample Tutorial object
			var sampleTutorial = new Tutorials({
				name: 'New Tutorial'
			});

			// Set the URL parameter
			$stateParams.tutorialId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tutorials\/([0-9a-fA-F]{24})$/).respond(sampleTutorial);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tutorial).toEqualData(sampleTutorial);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tutorials) {
			// Create a sample Tutorial object
			var sampleTutorialPostData = new Tutorials({
				name: 'New Tutorial'
			});

			// Create a sample Tutorial response
			var sampleTutorialResponse = new Tutorials({
				_id: '525cf20451979dea2c000001',
				name: 'New Tutorial'
			});

			// Fixture mock form input values
			scope.name = 'New Tutorial';

			// Set POST response
			$httpBackend.expectPOST('tutorials', sampleTutorialPostData).respond(sampleTutorialResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tutorial was created
			expect($location.path()).toBe('/tutorials/' + sampleTutorialResponse._id);
		}));

		it('$scope.update() should update a valid Tutorial', inject(function(Tutorials) {
			// Define a sample Tutorial put data
			var sampleTutorialPutData = new Tutorials({
				_id: '525cf20451979dea2c000001',
				name: 'New Tutorial'
			});

			// Mock Tutorial in scope
			scope.tutorial = sampleTutorialPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tutorials\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tutorials/' + sampleTutorialPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tutorialId and remove the Tutorial from the scope', inject(function(Tutorials) {
			// Create new Tutorial object
			var sampleTutorial = new Tutorials({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tutorials array and include the Tutorial
			scope.tutorials = [sampleTutorial];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tutorials\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTutorial);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tutorials.length).toBe(0);
		}));
	});
}());