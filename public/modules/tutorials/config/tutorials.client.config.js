'use strict';

// Configuring the Articles module
angular.module('tutorials').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tutorials', 'tutorials', 'dropdown', '/tutorials(/create)?');
		Menus.addSubMenuItem('topbar', 'tutorials', 'List Tutorials', 'tutorials');
		Menus.addSubMenuItem('topbar', 'tutorials', 'New Tutorial', 'tutorials/create');
	}
]);