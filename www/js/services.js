'use strict';

/* Services */

var frmServices = angular.module('frmServices', ['ngResource']);

frmServices.factory('Lessons', ['$resource',
  function($resource){
    return $resource('data/lessons.json', {}, {
      query: {method:'GET', params:{lessonId:'lessons'}, isArray:true}
    });
}]);

frmServices.factory('Readings', ['$resource',
  function($resource){
    return $resource('data/readings.json', {}, {
      query: {method:'GET', params:{readingId:'readings'}, isArray:true}
    });
}]);

frmServices.factory('Messages', ['$resource',
  function($resource){
    return $resource('data/messages.json', {}, {
      query: {method:'GET', params:{messageId:'messages'}, isArray:true}
    });
}]);

frmServices.factory('remoteDataService', ['$resource','$http',
  function($resource, $http){

  var remoteDataService = {};
  remoteDataService.$http = $http;

   //our service accepts a promise object which 
   //it will resolve on behalf of the calling function
   remoteDataService.fetchData = function(q,$http) {

     $http({method:'GET',url:'data/lessons.json'}).success(function(data){
         remoteDataService.data = data;
         q.resolve();
     });


   };

  return remoteDataService;

}]);

frmServices.factory('scheudlarBarSharedService', function($rootScope) {
	var sharedService = {};

	sharedService.lessonIndex = 0;
	sharedService.readingIndex = 0;
  sharedService.flagFilter = 0;
  sharedService.checkedFilter = 0;
  
  sharedService.selectItem = function(item) {
  	sharedService.lessonIndex = item;
    $rootScope.$broadcast('handleSelectItem');
  };

  sharedService.doneReadingItem = function(item) {
	sharedService.readingIndex = item;
    $rootScope.$broadcast('handleDoneReadingItem');
  };
  
  sharedService.loadData = function() {
  
  }
  

  return sharedService;
});