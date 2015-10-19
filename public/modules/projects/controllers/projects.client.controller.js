'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication', '$http', 'Projects', 'Pages',
	function($rootScope,$scope, $stateParams, $location, Authentication, $http, Projects, Pages) {
		$scope.authentication = Authentication;

		// Create new Project
		$scope.create = function() {
			// Create new Project object
			var project = new Projects ({
				name: $scope.frames.name,
				frames: $scope.frames.frames,
				frames_order: $scope.frames.frames_order,
				page_templates: $scope.frames.page_templates,
				samples: $scope.frames.samples,
				files: $scope.frames.files
			});

			// Redirect after save
			project.$save(function(response) {
				$location.path('projects/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.get_init_json = function(){
			console.log('GET_INIT_JSON!!!');
			$http.get('/modules/projects/views/projects.json').success(function(items) {
           		$scope.frames = items;
        		})
			console.log($scope.frames);
			};

		$scope.add_pages = function(unitname){
			var temp = $scope.frames.page_templates[unitname];
			console.log(temp);
			$scope.frames.frames.push({"unitname": temp.unitname, "pagename": temp.pagename, "page": temp.page});
		};	

		// Remove existing Project
		$scope.remove = function(project) {
			if ( project ) { 
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});

			function prepare_Menus(pid,frames,order){
				var menus = [];
				menus.push({'text': 'Main Navigation','type': 'heading','translate': 'sidebar.heading'});
				console.log(frames);
				for (var i = 0, len_i = order.unit.length; i < len_i; i++) {
					var unitname = order.unit[i];
  					var submenus = {'text': unitname,'sref': '#','icon': 'icon-box','subnav': [],'translate': 'sidebar.nav'};
  					var unit_name = frames[i].name;
  					for (var j = 0, len_j = frames.length; j < len_j; j++){
  						if(frames[j].unitname == unitname){
  							var page = frames[j];
  							submenus.subnav.push({'text': page.pagename, 'sref': 'subProject', 'myParams': {'subID' : page._id, 'projectId': pid, 'subname': 'frames'}, 'translate': 'sidebar.nav' });
							}
						};
					menus.push(submenus);
					}
				return menus;
				};

			setTimeout(function(){
				console.log($scope.project);
    			var menus = prepare_Menus($stateParams.projectId,$scope.project.frames,$scope.project.frames_order);
    			$rootScope.menuItems = menus;
    			console.log(menus);
    			$rootScope.$apply();
    			}
    			,1000);
		};


	}
]);