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
    remoteDataService.showFooter = true;

    localStorage.lessonData = null;
    localStorage.userMeta = null;
    localStorage.userSession = {};

    // Helper Functions
    var getLessons = function(readings) {

      var org = "week";
      if(remoteDataService.userData.settings.organizeBy == "topic") {
        org = "topic";
      }

      var lessons = [];        
      var topics = _.each(readings, function(item) {
            var found = _.findWhere(lessons, {id:item[org].id})
            if(typeof found === "undefined") {

              var newItem =  JSON.parse(JSON.stringify(item));
              var newLesson =  JSON.parse(JSON.stringify(item[org]));

              newLesson.readings = [];
              newLesson.readings.push(newItem);
              lessons.push(newLesson);

            } else {
              var newItem =  JSON.parse(JSON.stringify(item));
              found.readings.push(newItem);
            }
      }) 
      return _.sortBy(lessons, function(item){ return parseInt(item.order); });


    }


    //our service accepts a promise object which 
    //it will resolve on behalf of the calling function
    remoteDataService.fetchData = function(q,$http) {

      if(localStorage.lessonData == 'null' || typeof localStorage.lessonData === "undefined" || localStorage.lessonData === null) {


        $http({method:'GET',url:'data/user.json'}).success(function(data){

          remoteDataService.userData = data;
          localStorage.userData = JSON.stringify(data);

          // Keep for now
          localStorage.userMeta = []; // In future fetch from API
          remoteDataService.userMeta = [];

          $http({method:'GET',url:'data/readings.json'}).success(function(data){
             remoteDataService.readingData = data.readings;
             localStorage.readingData = JSON.stringify(data.readings);

             remoteDataService.lessonData = getLessons(remoteDataService.readingData);

            $http({method:'GET',url:'data/questions.json'}).success(function(data){
              remoteDataService.questionData = data.questions;
              localStorage.questionData = JSON.stringify(data.questions);

              q.resolve();

            });
          });
        });    

      } else {

        remoteDataService.readingData = JSON.parse(localStorage.readingData);
        remoteDataService.lessonData = getLessons(remoteDataService.readingData);

        remoteDataService.questionData = JSON.parse(localStorage.questionData);
        remoteDataService.userData = JSON.parse(localStorage.userData);

        // Keep for now
        if(localStorage.userMeta !== 'null' && typeof localStorage.userMeta !== "undefined" && localStorage.userMeta !== null && localStorage.userMeta != "")  {
          remoteDataService.userMeta = JSON.parse(localStorage.userMeta);
        } else {
          remoteDataService.userMeta =[];
        }
        q.resolve();
      }
    };

   remoteDataService.commitData = function() {
      //localStorage.lessonData = JSON.stringify(remoteDataService.lessonData);
      localStorage.userMeta = JSON.stringify(remoteDataService.userMeta);
      localStorage.userSession = JSON.stringify(remoteDataService.userSession);

   }

   remoteDataService.clearData = function() {
      localStorage.lessonData = null;
      localStorage.userMeta = null;
      localStorage.userSession = {};
   }

  // Lessons
  // Lesson is the Organized By Unit [ Week | Topic ]



  remoteDataService.getLessonByID = function(lessonId) {

  }

  remoteDataService.getFirstLesson = function() {
    return remoteDataService.lessonData[0];    
  }

  remoteDataService.isLessonInProgress = function() {

  }

  remoteDataService.isLessonDone = function() {
    
  }

  remoteDataService.getLessonReadings = function(lessonId) {
    
  }

  // Readings

  remoteDataService.getReadingByID = function(readingId,type) {
    
  }

  remoteDataService.toggelReadingStatus = function(readingId,type) {
    
  }

  remoteDataService.setReadingStatusTrue = function(readingId,type) {
    
  }

  remoteDataService.isReadingStatusTrue = function(readingId,type) {
    
  }

  remoteDataService.getNumberReadingNotes = function(readingId,type) {
    
  }

  remoteDataService.isReadingIntersectFlags = function(readingId,flags) {
    
  }

  remoteDataService.getReadingNotes = function(readingId) {
    
  }

  remoteDataService.addReadingNote = function(readingId) {
    
  }

  remoteDataService.deleteReadingNote = function(readingId) {
    
  }

  // User

  remoteDataService.getUserMetaByID = function(readingId) {
    
  }

  // Questions

  remoteDataService.getQuestionsIntersectCompletedReadings = function() {
    
  }

  remoteDataService.getQuestionsIntersectFlaggedReadings = function() {
    
  }

  remoteDataService.getQuestionsByTopic = function(topicId) {
    
  }

  remoteDataService.getAllQuestions = function(topicId) {
    
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
