'use strict';

//Setting up route
angular.module('infras').config(['$stateProvider',
	function($stateProvider) {
		// Infras state routing
		$stateProvider.
		state('listInfras', {
			url: '/infras',
			templateUrl: 'modules/infras/views/list-infras.client.view.html'
		}).
		state('createInfra', {
			url: '/infras/create',
			templateUrl: 'modules/infras/views/create-infra.client.view.html'
		}).
		state('viewInfra', {
			url: '/infras/:infraId',
			templateUrl: 'modules/infras/views/view-infra.client.view.html'
		}).
		state('editInfra', {
			url: '/infras/:infraId/edit',
			templateUrl: 'modules/infras/views/edit-infra.client.view.html'
		});
	}
]);