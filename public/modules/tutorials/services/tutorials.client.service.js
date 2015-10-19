'use strict';

//Tutorials service used to communicate Tutorials REST endpoints
angular.module('tutorials').factory('Tutorials', ['$resource',
	function($resource) {
		return $resource('tutorials/:tutorialId', { tutorialId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);