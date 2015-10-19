'use strict';

// Tutorials controller
angular.module('tutorials').controller('TutorialsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tutorials',
	function($scope, $stateParams, $location, Authentication, Tutorials) {
		$scope.authentication = Authentication;

		// Create new Tutorial
		$scope.create = function() {
			// Create new Tutorial object
			var tutorial = new Tutorials ({
				name: this.name
			});

			// Redirect after save
			tutorial.$save(function(response) {
				$location.path('tutorials/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tutorial
		$scope.remove = function(tutorial) {
			if ( tutorial ) { 
				tutorial.$remove();

				for (var i in $scope.tutorials) {
					if ($scope.tutorials [i] === tutorial) {
						$scope.tutorials.splice(i, 1);
					}
				}
			} else {
				$scope.tutorial.$remove(function() {
					$location.path('tutorials');
				});
			}
		};

		// Update existing Tutorial
		$scope.update = function() {
			var tutorial = $scope.tutorial;

			tutorial.$update(function() {
				$location.path('tutorials/' + tutorial._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tutorials
		$scope.find = function() {
			$scope.tutorials = Tutorials.query();
		};

		// Find existing Tutorial
		$scope.findOne = function() {
			$scope.tutorial = Tutorials.get({ 
				tutorialId: $stateParams.tutorialId
			});
		};
	}
]);