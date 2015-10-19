'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('Pages', ['$resource',
	function($resource) {
		return $resource('projects/:projectId/:subname/:subID', { 'projectId': '@projectId', 'subname': '@subname', 'subID':'@subID'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);