'use strict';

//Infras service used to communicate Infras REST endpoints
angular.module('infras').factory('Infras', ['$resource',
	function($resource) {
		return $resource('infras/:infraId', { infraId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);