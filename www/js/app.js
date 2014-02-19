'use strict';

/* App Module */

var phonecatApp = angular.module('frmApp', [
  'ngRoute',
  'ngSanitize',
  'frmAnimations',
  'frmControllers',
  'frmFilters',
  'frmServices'
]);

phonecatApp.config(['$routeProvider','$anchorScrollProvider','$locationProvider',
  function($routeProvider, $anchorScrollProvider, $locationProvider) {
    
    $routeProvider.
      when('/dashboard', {
        templateUrl: 'partials/frm-dashboard.html',
        controller: 'FRMAppDashboardCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;

          }
        }
      }).
      when('/dash', {
        templateUrl: 'partials/frm-dash.html',
        controller: 'FRMAppDashCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;

          }
        }
      }).
      when('/examday', {
        templateUrl: 'partials/frm-examday.html',
        controller: 'FRMExamDayCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;
          }
        }
      }).      
      when('/readings', {
        templateUrl: 'partials/frm-readings.html',
        controller: 'FRMReadingsCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;

          }
        }
      }).      
      when('/glossary', {
        templateUrl: 'partials/frm-glossary.html',
        controller: 'FRMGlossaryCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;
          }
        }
      }).
      when('/examsettings', {
        templateUrl: 'partials/frm-examSettings.html',
        controller: 'FRMExamSettingsCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;
          }
        }
      }).      
      when('/exam', {
        templateUrl: 'partials/frm-exam.html',
        controller: 'FRMExamCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;
          }
        }
      }).      
      when('/examresults', {
        templateUrl: 'partials/frm-examResults.html',
        controller: 'FRMExamResultsCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;
          }
        }
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
        controller: 'FRMAppMyAccountCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;
          }
        }
      }).      
      otherwise({
        redirectTo: '/login'
      });


      $locationProvider.hashPrefix('!');
	  
  }]);

  // Set User Agent 
  var b = document.documentElement;
  b.setAttribute('data-useragent',  navigator.userAgent);
  b.setAttribute('data-platform', navigator.platform );
  b.className += ((!!('ontouchstart' in window) || !!('onmsgesturechange' in window))?' touch':'');