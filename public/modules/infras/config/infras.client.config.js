'use strict';

// Configuring the Articles module
angular.module('infras').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Infras', 'infras', 'dropdown', '/infras(/create)?');
		Menus.addSubMenuItem('topbar', 'infras', 'List Infras', 'infras');
		Menus.addSubMenuItem('topbar', 'infras', 'New Infra', 'infras/create');
	}
]);