'use strict';

// Infras controller
angular.module('infras').controller('InfrasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Infras',
	function($scope, $stateParams, $location, Authentication, Infras) {
		$scope.authentication = Authentication;

		// Create new Infra
		$scope.create = function() {
			// Create new Infra object
			var infra = new Infras ({
				config_type: this.config_type,
				config_title: this.config_title,
				detailed: this.detailed
			});

			// Redirect after save
			infra.$save(function(response) {
				$location.path('infras/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Infra
		$scope.remove = function(infra) {
			if ( infra ) { 
				infra.$remove();

				for (var i in $scope.infras) {
					if ($scope.infras [i] === infra) {
						$scope.infras.splice(i, 1);
					}
				}
			} else {
				$scope.infra.$remove(function() {
					$location.path('infras');
				});
			}
		};

		// Update existing Infra
		$scope.update = function() {
			var infra = $scope.infra;

			infra.$update(function() {
				$location.path('infras/' + infra._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Infras
		$scope.find = function() {
			$scope.infras = Infras.query();
		};

		// Find existing Infra
		$scope.findOne = function() {
			$scope.infra = Infras.get({ 
				infraId: $stateParams.infraId
			});
		};
	}
]);