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


function defined(ref, strNames) {
    var name;
    
    if(typeof ref === "undefined" || ref === null ) {
      return false;
    }

    if(strNames !== null && typeof strNames !== "undefined") {
      var arrNames = strNames.split('.');
      while (name = arrNames.shift()) {        
          if (ref[name] === null || typeof ref[name] === "undefined" || !ref.hasOwnProperty(name)) return false;
          ref = ref[name];
      } 
    }
    return true;
}


phonecatApp.config(['$routeProvider','$anchorScrollProvider','$locationProvider','$stateProvider',
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
      when('/examresultsquestion', {
        templateUrl: 'partials/frm-examResultsQuestion.html',
        controller: 'FRMExamResultsQuestionCtrl',
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
        controller: 'FRMAppLoginCtrl'
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
      when('/alerts', {
        templateUrl: 'partials/frm-alerts.html',
        controller: 'FRMAppAlertsCtrl',
        resolve: {
          myVar: function($q,$http,remoteDataService){
            //code to be executed before route change goes here
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
            return defer.promise;
          }
        }
      })



      .      
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