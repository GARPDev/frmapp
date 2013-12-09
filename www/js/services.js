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

frmServices.factory('scheudlarBarSharedService', function($rootScope) {
	var sharedService = {};

	sharedService.lessonIndex = 0;
	sharedService.readingIndex = 0;
	sharedService.lessons = [];
	sharedService.readings = [];
	sharedService.messages = [];

  
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