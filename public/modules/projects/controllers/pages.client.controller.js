'use strict';

// Projects controller
angular.module('projects').controller('PagesController', ['$rootScope', '$scope', '$stateParams', '$location', '$http', 'Projects', 'Pages',
	function($rootScope, $scope, $stateParams, $location, $http, Projects, Pages) {

		$scope.get_pageInfo = function(){
			$scope.pageinfos = Pages.get($stateParams);
			$scope.tabledata = {};
  			$scope.listdatas = {};
			};

		$scope.templateUrl = function(ttype) {
    		var url = "/modules/projects/views/subPage-"+ttype+".html";
  			return url;
  			};

  		$scope.data_init = function(subname){
			//$scope.datas = Pages.get({'subname':subname, 'projectId':$stateParams.projectId});
			
			if(subname=='samples'){
				$scope.tabledata['samples'] = [{'name':'MT01', 'species':'hg19', 'sampleSource':'Mel', 'tags':'Mel'},{'name':'MT02', 'species':'hg19', 'sampleSource':'Mel', 'tags':'Mel'},
								{'name':'MT03', 'species':'hg19', 'sampleSource':'Mel', 'tags':'Mel'},{"name":"", "species":"", "sampleSource":"", "tags":""},
								{"name":"", "species":"", "sampleSource":"", "tags":""},{"name":"", "species":"", "sampleSource":"", "tags":""},{"name":"", "species":"", "sampleSource":"", "tags":""}];
				};
			if(subname=='files'){	
				$scope.tabledata['files'] = [{'sample':'MT01','filetag':'fq1','path':'/data/project01/datas/MT01.fq1.gz','method':'HISEQ'},
									{'sample':'MT01','filetag':'fq2','path':'/data/project01/datas/MT01.fq2.gz','method':'HISEQ'},
									{'sample':'MT02','filetag':'fq1','path':'/data/project01/datas/MT02.fq1.gz','method':'HISEQ'},
									{'sample':'MT02','filetag':'fq2','path':'/data/project01/datas/MT02.fq2.gz','method':'HISEQ'},
									{'sample':'MT03','filetag':'fq1','path':'/data/project01/datas/MT03.fq1.gz','method':'HISEQ'},
									{'sample':'MT03','filetag':'fq2','path':'/data/project01/datas/MT03.fq2.gz','method':'HISEQ'}
							]
				};

			$scope.listdatas[subname] = Pages.get({'subname':subname, 'projectId':$stateParams.projectId});
			$scope.listdatas[subname].$promise.then(function (result) {
   				var temp = [];
   				for (var i = 0; i < result[subname].length; i++){
   						if(result[subname][i].name || result[subname][i].sample){
   						temp.push(result[subname][i]);}
   					}
   				$scope.listdatas[subname] = temp;
   				console.log(temp);
				});
			console.log($scope.listdatas);
			};

		$scope.push2array = function(subname){
			var datas = [];
			console.log($scope.tabledata[subname]);
			for (var i = 0; i < $scope.tabledata[subname].length; i++){
				if($scope.tabledata[subname][i].name || $scope.tabledata[subname][i].sample){
					datas.push($scope.tabledata[subname][i]);
				}
			}
			console.log(datas);
			
			var addinfo = new Pages ({
				'projectId' : $stateParams.projectId,
				'subname' : subname,
				'adddata' : datas
			});

			addinfo.$save(function(response) {
                console.log(response);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            $scope.listdatas[subname] = Pages.get({'subname':subname, 'projectId':$stateParams.projectId});
			$scope.listdatas[subname].$promise.then(function (result) {
   				var temp = [];
   				for (var i = 0; i < result[subname].length; i++){
   						if(result[subname][i].name || result[subname][i].sample){
   						temp.push(result[subname][i]);}
   					}
   				$scope.listdatas[subname] = temp;
				});
			};

		$scope.tophat = function(){
			console.log('TTTTTTTT');
			$scope.listdatas['tophat'] = [
				{'sample':'MT01','filetag':'tophat','path':'/data/project01/datas/MT01.bam','method':'tophat /data/project01/datas/MT01.fq1.gz /data/project01/datas/MT01.fq2.gz'},
				{'sample':'MT02','filetag':'tophat','path':'/data/project01/datas/MT01.bam','method':'tophat /data/project01/datas/MT02.fq1.gz /data/project01/datas/MT02.fq2.gz'},
				{'sample':'MT03','filetag':'tophat','path':'/data/project01/datas/MT01.bam','method':'tophat /data/project01/datas/MT03.fq1.gz /data/project01/datas/MT03.fq2.gz'}
			];
			$scope.$apply();
			console.log($scope.listdatas['tophat']);
 		};
	}
]).controller('TABLE_ADD_Controller', ['$rootScope', '$scope', '$stateParams', '$location', '$http', 'Projects', 'Pages',
	function($rootScope, $scope, $stateParams, $location, $http, Projects, Pages) {	
	}
]);