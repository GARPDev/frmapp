'use strict';

/* App Module */

var phonecatApp = angular.module('frmApp', [
  'ngRoute',
  'ngSanitize',
  'frmAnimations',
  'frmControllers',
  'frmFilters',
  'frmServices',
  'angulartics', 'angulartics.google.analytics','angulartics.debug'
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

angular.module('ErrorCatcher', []).factory('$exceptionHandler', ['$injector', function ($injector) {
    return function errorCatcherHandler(exception, cause) {
        console.error(exception.stack);
        var msg = '';
        var file = '';
        var method = '';
        if(defined(exception,"stack") && (!defined(exception,"message") || exception.message.length == 0 )) {
          alert(exception.message);
        }
    };
}]);

phonecatApp.config(['$routeProvider', '$anchorScrollProvider', '$locationProvider', '$compileProvider', '$analyticsProvider',
function($routeProvider, $anchorScrollProvider, $locationProvider, $compileProvider, $analyticsProvider) {
    
  $analyticsProvider.virtualPageviews(false);

  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|blob:|data:image)/);

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
  })
  .when('/dash', {
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
  })
  .when('/examday', {
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
  })      
  .when('/readings', {
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
  })      
  .when('/glossary/:searchString?', {
    templateUrl: 'partials/frm-glossary.html',
    controller: 'FRMGlossaryCtrl',
    resolve: {
      myVar: function($q, $http, remoteDataService){
        //code to be executed before route change goes here
        var defer = $q.defer();
        remoteDataService.fetchData(defer, $http);
        return defer.promise;
      }
    }
  })
  .when('/examsettings', {
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
  })      
  .when('/exam', {
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
  })      
  .when('/examresults', {
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
  })      
  .when('/examresultsquestion', {
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
  })      
  .when('/login', {
    templateUrl: 'partials/frm-login.html',
    controller: 'FRMAppLoginCtrl'
  })      
  .when('/myaccount', {
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
  }) 
  .when('/pickexam', {
    templateUrl: 'partials/choose-exam-splash-exam.html',
    controller: 'ChooseExamCtrl'
  })     
  .when('/alerts', {
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
  .otherwise({
    redirectTo: '/login'
  });

    $locationProvider.hashPrefix('!');
	  
}]);

phonecatApp.run(['configuration', '$analytics', 'GarpAnalytics', function(configuration, $analytics, GarpAnalytics){

  //Vendor Script to include GA
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  //Initializing Google Analytics with the configuration defined in `config`
  ga('create', configuration.gaId, 'auto');

}]);

// Set User Agent 
var b = document.documentElement;
b.setAttribute('data-useragent',  navigator.userAgent);
b.setAttribute('data-platform', navigator.platform );
b.className += ((!!('ontouchstart' in window) || !!('onmsgesturechange' in window))?' touch':'');