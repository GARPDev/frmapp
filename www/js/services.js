'use strict';

/* Services */
var NO_FETCH = 99;
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

frmServices.factory('mapService', ['$resource','$http',
  function($resource, $http){


    var mapService = {};

    var geocoder;
    var map;
    var mapOptions = {
        zoom: 8
      };

    mapService.displayMap=function(selector, address) {
      map = new google.maps.Map(document.getElementById(selector), mapOptions);
      geocoder = new google.maps.Geocoder();
      
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
        } else {
          $('#'+selector).innerHTML = ' Geocode was not successful for the following reason: ' + status;
        }
      });

    }

    return mapService;

  }
]);



frmServices.factory('navigationService', ['$resource','$http',
  function($resource, $http){


    var navigationService = {};

    navigationService.pageTransitionOut = function(view) {
      $('.page-container').fadeOut(function() {
        if(view !== null && typeof view !== "undefined") {
          document.location.hash = '#!/' + view;
        }
      });
    }

    navigationService.pageTransitionIn = function() {
      $('.page-container').fadeIn();
      //$('.page-container').show("slide", { direction: "left" }, 500); 
    }


    navigationService.changeView = function(view) {
      navigationService.pageTransitionOut(view);
    }


    return navigationService;

  }
]);



frmServices.factory('remoteDataService', ['$resource','$http',
  function($resource, $http){

    var remoteDataService = {};
    remoteDataService.$http = $http;
    remoteDataService.userInfo = {};
    remoteDataService.showFooter = true;
    remoteDataService.searchTerms = "";

    // localStorage.readingData = null;
    // localStorage.userMeta = null;
    // localStorage.glossaryData = null;


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


    remoteDataService.changeOrgOption = function(org) {
      remoteDataService.userData.settings.organizeBy = org;
      remoteDataService.lessonData = getLessons(remoteDataService.readingData.readings);
    }


    var fetchRemoteData=function(url,propertyName,callback) {
      $http({method:'GET',url:url}).success(function(data){

        remoteDataService[propertyName] = data;
        localStorage[propertyName] = JSON.stringify(data);

        callback(null, data);
      }).error(function(data, status, headers, config) {
        callback(status, null);
      });
    }

    var fetchData=function(url,propertyName, callback) {

      if(remoteDataService[propertyName] == 'null' || typeof remoteDataService[propertyName] === "undefined" || remoteDataService[propertyName] === null) {

        if(localStorage[propertyName] == 'null' || typeof localStorage[propertyName] === "undefined" || localStorage[propertyName] === null) {

          fetchRemoteData(url,propertyName,callback);

        } else {

          try {
            //Run some code here
            remoteDataService[propertyName] = JSON.parse(localStorage[propertyName]);
            callback(null, remoteDataService[propertyName]);
          } catch(err) {
            //Handle errors here
            fetchRemoteData(url,propertyName,callback);
          }
        }
      } else {
        callback(NO_FETCH, remoteDataService[propertyName]);
      }
    }



    //our service accepts a promise object which 
    //it will resolve on behalf of the calling function
    remoteDataService.fetchData = function(q,$http) {

      //remoteDataService.clearData();

      fetchData('data/user.json', 'userData', function(err, data) {

        if(err != NO_FETCH) {
          // For easy access seperate userMeta from userData
          remoteDataService.userMeta = [];
          remoteDataService.userMeta = data.userMeta;
        }
        
        fetchData('data/readings.json', 'readingData', function(err, data) {

          remoteDataService.lessonData = getLessons(remoteDataService.readingData.readings);

          fetchData('data/questions.json', 'questionData', function(err, data) {

            remoteDataService.questionData = data.questions;

            fetchData('data/glossary.json', 'glossaryData', function(err, data) {

              q.resolve();

            });
          });
        });
      });

    };

   remoteDataService.commitData = function() {
      localStorage.userMeta = JSON.stringify(remoteDataService.userMeta);

      var userData = JSON.parse(localStorage.userData);
      userData.userMeta = remoteDataService.userMeta;
      localStorage.userData = JSON.stringify(userData);
   }

   remoteDataService.clearData = function() {
      localStorage.userData = null;
      localStorage.userMeta = null;
      localStorage.readingData = null;
      localStorage.questionData = null;
      localStorage.glossaryData = null;
      localStorage.userSession = {};
   }

  // Lessons
  // Lesson is the Organized By Unit [ Week | Topic ]
  remoteDataService.getLessonByID = function(lessonId) {
    return _.findWhere(remoteDataService.lessonData, {id: lessonId});
  }

  remoteDataService.getFirstLesson = function() {
    return remoteDataService.lessonData[0];    
  }

  remoteDataService.isLessonInProgress = function(id) {

    var lesson = _.findWhere(remoteDataService.lessonData, {id: id});

    if(lesson !== null && typeof lesson !== "undefined") {

      var readings = lesson.readings;
      var readingsIds = _.pluck(readings, 'id');

      var meta = _.where(remoteDataService.userMeta, {checked: true});
      if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
        var metaIds = _.pluck(meta, 'id');
        var inter = _.intersection(readingsIds,metaIds)

        if(inter.length > 0)
          return true
        else return false;

      } else {
        return false;
      }

    } else {
      return false;
    }


  }

  remoteDataService.isLessonDone = function() {
    
  }

  remoteDataService.getLessonReadings = function(lessonId) {
    
  }

  // Readings
  remoteDataService.getPercentCompleteTotals = function() {

    var allReadings = _.flatten(_.pluck(remoteDataService.lessonData,'readings'))
    var doneItems = _.where(remoteDataService.userMeta, {checked: true});     
    if(doneItems !== null && typeof doneItems !== "undefined") {
      if(Object.prototype.toString.call(doneItems) != "[object Array]") {
        var newDoneItems = [];
        newDoneItems.push(doneItems);
        doneItems = newDoneItems;
      }
    }

    function roundNumber(rnum, rlength) { 
      var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
      return newnumber;
    }

    var percentComplete = 0;
    if(allReadings.length > 0) {
      var percentComplete = roundNumber((doneItems.length/allReadings.length)*100,0);
    }

    var returnObject = {
      totalReadings: allReadings.length,
      totalDoneItems: doneItems.length,
      percentComplete: percentComplete
    }

    return returnObject;
  }


  remoteDataService.getReadingByID = function(readingId,type) {
    return _.findWhere(remoteDataService.userMeta, {id: readingId});
  }

  remoteDataService.toggelReadingAttribute = function(readingId,type) {

    var foundItem = remoteDataService.getReadingByID(readingId);
    if(foundItem === null || typeof foundItem === "undefined") {
      var newItem = {id: readingId};
      newItem[type] = true;
      remoteDataService.userMeta.push(newItem);
    } else {
      foundItem[type]=!foundItem[type];
    }

    remoteDataService.commitData();
    
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

	sharedService.lessonIndex = null;
	sharedService.readingIndex = 0;
  sharedService.allMode = false;
  
  sharedService.selectItem = function(item) {
  	sharedService.lessonIndex = item;
    $rootScope.$broadcast('handleTopicSelectItem');
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
    $rootScope.$broadcast('handleFilterReadingList',filterType,sharedService.filters[filterType]);
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
  sharedService.wrongAnswers = 0;
  sharedService.skipQuestions = 0;

  sharedService.resetData = function() {
    sharedService.userAnswers = [];
    sharedService.correctAnswers = 0;
    sharedService.wrongAnswers = 0;
    sharedService.skipQuestions = 0;    
  }


  return sharedService;
});
