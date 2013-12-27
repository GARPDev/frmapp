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

    remoteDataService.userInfo = {};
    

    //our service accepts a promise object which 
    //it will resolve on behalf of the calling function
    remoteDataService.fetchData = function(q,$http) {




      if(localStorage.lessonData == 'null' || typeof localStorage.lessonData === "undefined" || localStorage.lessonData === null) {


        $http({method:'GET',url:'data/user.json'}).success(function(data){
           remoteDataService.userData = data;
           localStorage.userData = JSON.stringify(data);


          $http({method:'GET',url:'data/lessons.json'}).success(function(data){
             remoteDataService.lessonData = data.lessons;
             localStorage.lessonData = JSON.stringify(data.lessons);

            $http({method:'GET',url:'data/questions.json'}).success(function(data){
              remoteDataService.questionData = data.questions;
              localStorage.questionData = JSON.stringify(data.questions);

              localStorage.userMeta = []; // In future fetch from API
              remoteDataService.userMeta = [];
              q.resolve();

            });
          });
        });    

      } else {
        remoteDataService.lessonData = JSON.parse(localStorage.lessonData);
        remoteDataService.questionData = JSON.parse(localStorage.questionData);
        remoteDataService.userData = JSON.parse(localStorage.userData);

        if(localStorage.userMeta !== 'null' && typeof localStorage.userMeta !== "undefined" && localStorage.userMeta !== null && localStorage.userMeta != "")  {
          remoteDataService.userMeta = JSON.parse(localStorage.userMeta);
        } else {
          remoteDataService.userMeta =[];
        }
        q.resolve();
      }
    };

   remoteDataService.commitData = function() {
      localStorage.lessonData = JSON.stringify(remoteDataService.lessonData);
      localStorage.userMeta = JSON.stringify(remoteDataService.userMeta);
      localStorage.userSession = JSON.stringify(remoteDataService.userSession);

   }

   remoteDataService.clearData = function() {
      localStorage.lessonData = null;
      localStorage.userMeta = null;
      localStorage.userSession = {};
   }

  return remoteDataService;

}]);

frmServices.factory('scheduleBarSharedService', function($rootScope) {
	var sharedService = {};

	sharedService.lessonIndex = 1;
	sharedService.readingIndex = 0;
  sharedService.allMode = false;
  
  sharedService.selectItem = function(item) {
  	sharedService.lessonIndex = item;
    $rootScope.$broadcast('handleScheduleBarSelectItem');
  };

  sharedService.doneReadingItem = function(item) {
	sharedService.readingIndex = item;
    $rootScope.$broadcast('handleDoneReadingItem');
  };
    
  return sharedService;
});

frmServices.factory('readlingListSharedService', function($rootScope) {
  var sharedService = {};
  sharedService.filters = {
    flagged: 0,
    checked: 0
  };
  sharedService.readingIndex = "";

  sharedService.setReadingIndex = function(id) {
    sharedService.readingIndex = id;
    $rootScope.$broadcast('handleSetReadingIndex');
  }

  sharedService.filterList = function(filterType) {
    sharedService.filters[filterType] = !sharedService.filters[filterType];
    //$rootScope.$broadcast('handleFilterList');
  };

  sharedService.clearFilters = function() {
    sharedService.filters = {
      flagged: 0,
      checked: 0
    };

  }    
  return sharedService;
});

frmServices.factory('examSharedService', function($rootScope) {
  var sharedService = {};

  sharedService.settings = {};
  sharedService.questions = [];
  sharedService.userAnswers = [];
  sharedService.correctAnswers = 0;


  return sharedService;
});
