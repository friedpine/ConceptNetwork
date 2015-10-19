'use strict';
// Use Applicaion configuration module to register a new module
//ApplicationConfiguration.registerModule('core');

var applicationModuleName = 'conceptnetwork';
var moduleName = 'core';
var dependencies = ['ngResource','ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils','ngStorage','pascalprecht.translate','ngRoute'];

angular.module(moduleName, dependencies || []);
angular.module(applicationModuleName).requires.push(moduleName);

angular.module(moduleName).run(['$rootScope', '$state', '$stateParams', '$localStorage','Authentication', function ($rootScope, $state, $stateParams, $localStorage, Authentication) {
    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $localStorage;
    $rootScope.authentication  = Authentication;

    // Scope Globals
    // ----------------------------------- 
    $rootScope.app = {
      name: 'Singular',
      description: 'Bootstrap + AngularJS',
      year: ((new Date()).getFullYear()),
      viewAnimation: 'ng-fadeInLeft2',
      layout: {
        isFixed: true,
        isBoxed: false,
        isRTL: false
      },
      sidebar: {
        isCollapsed: false,
        slide: false
      },
      themeId: 0,
      theme: {
        sidebar: 'bg-inverse',
        brand:   'bg-inverse',
        topbar:  'bg-white'
      }
    };
    
    // User information
    $rootScope.user = {
      name:     'Xiannian Zhang',
      job:      'Developer',
      picture:  'app/img/user/02.jpg'
    };

  }
]);