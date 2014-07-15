frmServices.factory('remoteDataService', ['$resource','$http','authenticationService',
  function($resource, $http, authenticationService){

    var remoteDataService = {};

    var serverURL = "http://ec2-54-186-51-192.us-west-2.compute.amazonaws.com:3000";

    remoteDataService.$http = $http;
    remoteDataService.userInfo = {};
    remoteDataService.showFooter = true;
    remoteDataService.searchTerms = "";

    remoteDataService.opp = [];

    // localStorage.readingData = null;
    // localStorage.metaData = null;
    // localStorage.glossaryData = null;


    // Helper Functions
    var getLessons = function(readings) {

      var org = "week";
      if(remoteDataService.userData !== null && typeof remoteDataService.userData !== "undefined" &&
         remoteDataService.userData.settings !== null && typeof remoteDataService.userData.settings !== "undefined") {
        if(remoteDataService.userData.settings.organizeBy == "topic") {
          org = "topic";
        }

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


    var fetchRemoteData=function(url,propertyName,remotePropertyName,callback) {
    
      if(navigator.camera) {
        url = serverURL + url;
      }    
      $http({method:'GET',url:url}).success(function(data){

        if(remotePropertyName != null) {
          remoteDataService[propertyName] = data[remotePropertyName];
          localStorage[propertyName] = JSON.stringify(data[remotePropertyName]);
          callback(null, data[remotePropertyName]);
        } else {        
          remoteDataService[propertyName] = data;
          localStorage[propertyName] = JSON.stringify(data);
          callback(null, data);
        }
        
      }).error(function(data, status, headers, config) {
        callback(status, null);
      });
    }

    var fetchData=function(url,propertyName, remotePropertyName, callback) {

      if(remoteDataService[propertyName] == 'null' || typeof remoteDataService[propertyName] === "undefined" || remoteDataService[propertyName] === null) {

        if(localStorage[propertyName] == 'null' || typeof localStorage[propertyName] === "undefined" || localStorage[propertyName] === null) {

          fetchRemoteData(url,propertyName,remotePropertyName,callback);

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


    remoteDataService.getOppertunities = function() {

      $http({method:'GET',url:'/sfdc/oppertunities'}).success(function(data){
        remoteDataService.opp = data;
      });

    }


    //our service accepts a promise object which 
    //it will resolve on behalf of the calling function
    remoteDataService.fetchData = function(q,$http) {

      //remoteDataService.clearData();

      if(authenticationService.user === null || typeof authenticationService.user === "undefined") {
          return null;
      }

      if(remoteDataService.userData === null || typeof remoteDataService.userData === "undefined") {
        remoteDataService.userData = authenticationService.user;
      }

      if(localStorage["userData"] == 'null' || typeof localStorage["userData"] === "undefined" || localStorage["userData"] === null) {
        localStorage["userData"] = JSON.stringify(authenticationService.user);
      }

      fetchData('/frmApp/user/' + authenticationService.user.Id + '/exam', 'registeredExam', null, function(err, data) {

        if(err != NO_FETCH) {
          remoteDataService.userData.registeredExam = data;
        }

        fetchData('/frmApp/user/' + authenticationService.user.Id + '/metaData', 'metaData', 'metaData', function(err, data) {

          if(err != NO_FETCH) {

            if(err == 404) {
              data = [];
              localStorage.metaData = JSON.stringify(data);
              remoteDataService.metaData = data;
            }
            remoteDataService.userData.metaData = data;
          }


          fetchData('/frmApp/user/' + authenticationService.user.Id + '/settings', 'userSettings', 'settings', function(err, data) {

            if(err != NO_FETCH) {
              if(err == 404) {
                data = {
                  organizeBy:"topic"
                };
                localStorage.userSettings = JSON.stringify(data);
                remoteDataService.userSettings = data;
              }
              remoteDataService.userData.settings = data;
              localStorage.userData = JSON.stringify(remoteDataService.userData);
              // remoteDataService.metaData = [];
              // remoteDataService.metaData = data.metaData;
              if(msgId != '') {
                remoteDataService.userData.settings.msgId = msgId;
                remoteDataService.commitData();                
              }
            }
            
            fetchData('/frmapp/www/data/readings.json', 'readingData', null, function(err, data) {

              if(err != NO_FETCH) {
                remoteDataService.lessonData = getLessons(remoteDataService.readingData.readings);
              }

              fetchData('/frmapp/www/data/questions.json', 'questionData', null, function(err, data) {

                if(err != NO_FETCH) {
                  remoteDataService.questionData = data.questions;
                }

                fetchData('/frmapp/www/data/glossary.json', 'glossaryData', null, function(err, data) {

                  q.resolve();

                });
              });
            });
          });
        });
      });
    };

   remoteDataService.commitData = function() {

    var url = '';
    if(navigator.camera) {
      url = serverURL + url;
    }    


    $http.put(url + '/frmApp/user/' + authenticationService.user.Id + '/settings', remoteDataService.userSettings).success(function(data){

      localStorage.userSettings = JSON.stringify(remoteDataService.userSettings);

      $http.put(url + '/frmApp/user/' + authenticationService.user.Id + '/metaData', remoteDataService.metaData).success(function(data){

        localStorage.metaData = JSON.stringify(remoteDataService.metaData);


      }).error(function(data, status, headers, config) {
        callback(status, null);
      });

    }).error(function(data, status, headers, config) {
      callback(status, null);
    });

      // var userData = JSON.parse(localStorage.userData);
      // userData.metaData = remoteDataService.metaData;
      // localStorage.userData = JSON.stringify(userData);
   }

   remoteDataService.clearData = function() {
      localStorage.userData = null;
      remoteDataService.userData = null;

      localStorage.metaData = null;
      remoteDataService.metaData = null;

      localStorage.userSettings = null;
      remoteDataService.userSettings = null;

      localStorage.registeredExam = null;
      remoteDataService.registeredExam = null;

      localStorage.readingData = null;
      remoteDataService.readingData = null;

      localStorage.questionData = null;
      remoteDataService.questionData = null;

      localStorage.glossaryData = null;
      remoteDataService.glossaryData = null;

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

      var meta = _.where(remoteDataService.metaData, {done: true});
      if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
        var metaIds = _.pluck(meta, 'readingId');
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
    var doneItems = _.where(remoteDataService.metaData, {done: true});     
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
    return _.findWhere(remoteDataService.metaData, {readingId: readingId});
  }

  remoteDataService.toggelReadingAttribute = function(readingId,type) {

    var foundItem = remoteDataService.getReadingByID(readingId);
    if(foundItem === null || typeof foundItem === "undefined") {
      var newItem = {readingId: readingId};
      newItem[type] = true;
      remoteDataService.metaData.push(newItem);
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

  remoteDataService.getmetaDataByID = function(readingId) {
    
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