'use strict';

// Configuring the Articles module
angular.module('projects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
		Menus.addSubMenuItem('topbar', 'projects', 'List Projects', 'projects');
		Menus.addSubMenuItem('topbar', 'projects', 'New Project', 'projects/create');
		Menus.addSubMenuItem('topbar', 'projects', 'New Project', '##');
		Menus.addSubMenuItem('topbar', 'projects', 'LH', 'projects/LH');
		Menus.addSubMenuItem('topbar', 'projects', 'RNA-Methods', 'projects/rna_methods');
		Menus.addSubMenuItem('topbar', 'projects', 'SuperSeq', 'projects/superseq');
	}
]);