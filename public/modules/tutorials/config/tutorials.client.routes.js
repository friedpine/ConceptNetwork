'use strict';

//Setting up route
angular.module('tutorials').config(['$stateProvider',
	function($stateProvider) {
		// Tutorials state routing
		$stateProvider.
		state('listTutorials', {
			url: '/tutorials',
			templateUrl: 'modules/tutorials/views/list-tutorials.client.view.html'
		}).
		state('createTutorial', {
			url: '/tutorials/create',
			templateUrl: 'modules/tutorials/views/create-tutorial.client.view.html'
		}).
		state('viewTutorial', {
			url: '/tutorials/:tutorialId',
			templateUrl: 'modules/tutorials/views/view-tutorial.client.view.html'
		}).
		state('editTutorial', {
			url: '/tutorials/:tutorialId/edit',
			templateUrl: 'modules/tutorials/views/edit-tutorial.client.view.html'
		});
	}
]);