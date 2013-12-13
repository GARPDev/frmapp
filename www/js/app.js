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
      when('/examday', {
        templateUrl: 'partials/frm-examday.html',
        controller: 'FRMAppDashCtrl'}).      
      when('/readings', {
        templateUrl: 'partials/frm-readings.html',
        controller: 'FRMReadingsCtrl'
      }).      
      when('/examsettings', {
        templateUrl: 'partials/frm-examSettings.html',
        controller: 'FRMExamSettingsCtrl'
      }).      
      when('/exam', {
        templateUrl: 'partials/frm-exam.html',
        controller: 'FRMExamCtrl'
      }).      
      when('/examresults', {
        templateUrl: 'partials/frm-examResults.html',
        controller: 'FRMExamResultsCtrl'
      }).      
      when('/login', {
        templateUrl: 'partials/frm-login.html',
        controller: 'FRMAppLoginCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;

          }
        }
        
      }).      
      when('/myaccount', {
        templateUrl: 'partials/frm-myaccount.html',
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
        redirectTo: '/login'
      });
	  
  }]);
