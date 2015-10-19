'use strict';

(function() {
	// Infras Controller Spec
	describe('Infras Controller Tests', function() {
		// Initialize global variables
		var InfrasController,
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

			// Initialize the Infras controller.
			InfrasController = $controller('InfrasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Infra object fetched from XHR', inject(function(Infras) {
			// Create sample Infra using the Infras service
			var sampleInfra = new Infras({
				name: 'New Infra'
			});

			// Create a sample Infras array that includes the new Infra
			var sampleInfras = [sampleInfra];

			// Set GET response
			$httpBackend.expectGET('infras').respond(sampleInfras);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.infras).toEqualData(sampleInfras);
		}));

		it('$scope.findOne() should create an array with one Infra object fetched from XHR using a infraId URL parameter', inject(function(Infras) {
			// Define a sample Infra object
			var sampleInfra = new Infras({
				name: 'New Infra'
			});

			// Set the URL parameter
			$stateParams.infraId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/infras\/([0-9a-fA-F]{24})$/).respond(sampleInfra);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.infra).toEqualData(sampleInfra);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Infras) {
			// Create a sample Infra object
			var sampleInfraPostData = new Infras({
				name: 'New Infra'
			});

			// Create a sample Infra response
			var sampleInfraResponse = new Infras({
				_id: '525cf20451979dea2c000001',
				name: 'New Infra'
			});

			// Fixture mock form input values
			scope.name = 'New Infra';

			// Set POST response
			$httpBackend.expectPOST('infras', sampleInfraPostData).respond(sampleInfraResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Infra was created
			expect($location.path()).toBe('/infras/' + sampleInfraResponse._id);
		}));

		it('$scope.update() should update a valid Infra', inject(function(Infras) {
			// Define a sample Infra put data
			var sampleInfraPutData = new Infras({
				_id: '525cf20451979dea2c000001',
				name: 'New Infra'
			});

			// Mock Infra in scope
			scope.infra = sampleInfraPutData;

			// Set PUT response
			$httpBackend.expectPUT(/infras\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/infras/' + sampleInfraPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid infraId and remove the Infra from the scope', inject(function(Infras) {
			// Create new Infra object
			var sampleInfra = new Infras({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Infras array and include the Infra
			scope.infras = [sampleInfra];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/infras\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInfra);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.infras.length).toBe(0);
		}));
	});
}());