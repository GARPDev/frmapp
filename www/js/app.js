'use strict';

/* App Module */

var phonecatApp = angular.module('frmApp', [
  'ngRoute',
  'frmAnimations',
  'frmControllers',
  'frmFilters',
  'frmServices'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/dash', {
        templateUrl: 'partials/frm-dash.html',
        controller: 'FRMAppDashCtrl'
      }).
	  /*
	  .		
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).*/
      otherwise({
        redirectTo: '/dash'
      });
	  
  }]);
