frmServices.factory('remoteDataService', ['$resource','$http','$q','authenticationService',
  function($resource, $http, $q, authenticationService){

    var remoteDataService = {};

    // var serverURL = "http://www.garp.org";
    var serverURL = "http://preprod.garp.org:8080"

    remoteDataService.$http = $http;
    remoteDataService.userInfo = {};
    remoteDataService.examInfo = {};
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
       remoteDataService.userSettings !== null && typeof remoteDataService.userSettings !== "undefined") {
        if(remoteDataService.userSettings.organizeBy == "topic") {
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
          newLesson.exam = item.exam;
          lessons.push(newLesson);

        } else {
          var newItem =  JSON.parse(JSON.stringify(item));
          found.readings.push(newItem);
        }
      }) 
      var pad = "0000";
      return _.sortBy(lessons, function(item){ 
        var str = "" + item.order;
        return item.exam + pad.substring(0, pad.length - str.length) + str; 
      });
    }

    remoteDataService.changeOrgOption = function(org) {
      remoteDataService.userSettings.organizeBy = org;
      remoteDataService.lessonData = getLessons(remoteDataService.readingData.readings);
    }


    var fetchRemoteData=function(url,propertyName,remotePropertyName,callback) {

      // Offline
      if(!isOnline()) {

        alert("You are currently offline. Please re-login when you are back online to continue to use the app.")
        callback(401, null);

      } else {

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
    }

    var fetchDataObj=function(obj, callback) {
      fetchData(obj.url,obj.propertyName, obj.remotePropertyName, function(err, data) {
        callback(null, {propertyName: obj.propertyName, data: data, err: err});

      });
    }

    var fetchData=function(url,propertyName, remotePropertyName, callback) {

      if(remoteDataService[propertyName] == 'null' || typeof remoteDataService[propertyName] === "undefined" || remoteDataService[propertyName] === null) {

        if(localStorage[propertyName] == 'null' || typeof localStorage[propertyName] === "undefined" || localStorage[propertyName] === null) {

          fetchRemoteData(url,propertyName,remotePropertyName,callback);

        } else {

          try {
            remoteDataService[propertyName] = JSON.parse(localStorage[propertyName]);
            callback(null, remoteDataService[propertyName]);
          } catch(err) {
            fetchRemoteData(url,propertyName,null,callback);
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

    remoteDataService.getExamRegistrations = function(contactId, callback) {
      var url ='/frmApp/user/' + contactId + '/exam';
      if(navigator.camera) {
        url = serverURL + url;
      }    

      $http({
        url: url,
        method: "GET",
        headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
        callback(status, data);
      }).error(function (data, status, headers, config) {
       callback(status, data);
     });
    }



    remoteDataService.sendMsg = function(title, msg, sound, sites, callback) {

      var msgObj = {
        title: title,
        msg: msg,
        sound: sound,
        sites: sites
      }

      var url = '/frmApp/user/'
      if(navigator.camera) {
        url = serverURL + url;
      }    

      $http({
        url: url + authenticationService.user.Id + '/msg',
        method: "POST",
        data: msgObj,
        headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
        callback(status, data);
      }).error(function (data, status, headers, config) {
       callback(status, data);
     });
    }

    //our service accepts a promise object which 
    //it will resolve on behalf of the calling function
    remoteDataService.fetchData = function(q,$http) {

      if(authenticationService.user === null || typeof authenticationService.user === "undefined") {
        return null;
      }

      if(localStorage["userData"] == 'null' || typeof localStorage["userData"] === "undefined" || localStorage["userData"] === null) {
        localStorage["userData"] = JSON.stringify(authenticationService.user);
      }

      var reqs = [];

      // if(defined(remoteDataService,"userData.contact.examRegistrations")) {

      //   var data = remoteDataService.userData.contact.examRegistrations;
      //   remoteDataService.registeredExam = data;
      //   remoteDataService.userData.registeredExam = data;
      //   localStorage.registeredExam = JSON.stringify(data);

      // } else {

      //   var examFetch = {
      //     url : '/frmApp/user/' + authenticationService.user.contact.Id + '/exam', 
      //     propertyName: 'registeredExam',
      //     remotePropertyName: null
      //   }
      //   reqs.push(examFetch);
      // }

      var metaDataFetch = {
        url : '/frmApp/user/' + authenticationService.user.contact.Id + '/metaData', 
        propertyName: 'metaData',
        remotePropertyName: 'metaData'
      }
      reqs.push(metaDataFetch);

      var settingsDataFetch = {
        url : '/frmApp/user/' + authenticationService.user.contact.Id + '/settings', 
        propertyName: 'userSettings',
        remotePropertyName: 'settings'
      }
      reqs.push(settingsDataFetch);

      var examSitesDataFetch = {
        url : '/sfdc/exam/sites', 
        propertyName: 'examSites',
        remotePropertyName: 'records'
      }
      reqs.push(examSitesDataFetch);

      var now = new Date()
      var year = now.getYear() + 1900;

      var readingsDataFetch = {
        //url : '/frmapp/www/data/readings.json', 
        url : '/frmApp/readings/' + remoteDataService.examInfo.exam + '/' + year, 
        propertyName: 'readingData',
        remotePropertyName: null
      }
      reqs.push(readingsDataFetch);

      var questionsDataFetch = {
        //url : '/frmapp/www/data/questions.json', 
        url : '/frmApp/questions/' + remoteDataService.examInfo.exam + '/' + year, 
        propertyName: 'questionData',
        remotePropertyName: null
      }
      reqs.push(questionsDataFetch);

      var questionsReadingsDataFetch = {
        //url : '/frmapp/www/data/questions.json', 
        url : '/frmApp/questionsReadings/' + remoteDataService.examInfo.exam + '/' + year, 
        propertyName: 'questionsReadingsData',
        remotePropertyName: null
      }
      reqs.push(questionsReadingsDataFetch);

      var glossaryDataFetch = {
        url : '/frmapp/www/data/glossary.json', 
        propertyName: 'glossaryData',
        remotePropertyName: null
      }
      reqs.push(glossaryDataFetch);

      async.map(reqs, fetchDataObj, function(err, results){

        // results is now an array of stats for each file
        for(var i=0; i<results.length; i++) {

          var data = results[i].data;
          var err = results[i].err;
          var propertyName = results[i].propertyName;

          if(err == 401) {
            q.resolve();
            return;
          }

          switch(propertyName) {
            case 'metaData':
            if(err != NO_FETCH) {
              if(err == 404 || data === null || typeof data === 'undefined') {
                data = [];
                localStorage.metaData = JSON.stringify(data);
                remoteDataService.metaData = data;
              }
              remoteDataService.userData.metaData = data;
            }
            break;
            case 'userSettings':
            if(err != NO_FETCH) {
              if(err == 404) {
                data = {
                  organizeBy:"topic"
                };
                localStorage.userSettings = JSON.stringify(data);
                remoteDataService.userSettings = data;
              }
              remoteDataService.userSettings = data;
              localStorage.userData = JSON.stringify(remoteDataService.userData);
              if(gcmId != '') {       
                remoteDataService.userSettings.gcmId = gcmId;
              }
              if(apnId != '') {       
                remoteDataService.userSettings.apnId = apnId;
              }
              if(remoteDataService.examInfo.regdata.length > 0) {
                remoteDataService.userSettings.examId = remoteDataService.examInfo.regdata[0].Exam_Site__c; 
              }
            }
            break;

            case 'examSites':
            if(err != NO_FETCH) {
              for(var j=0; j<data.length; j++) {
                data[j].selected=0;
              }
              remoteDataService.examSites = data;
            }
            break;

            case 'readingData':
            if(err != NO_FETCH) {
              var readObj = {
                id: remoteDataService.examInfo.EXAM + year,
                readings: []
              }
              for(var j=0; j<data.records.length; j++) {
                var reading = data.records[j];
                if(defined(reading,"Study_App_Lesson_Plan__r.Week__c") && 
                 defined(reading,"Study_App_Lesson_Plan__r.Description__c") &&
                 defined(reading,"Study_App_Lesson_Plan__r.Exam__c")) {

                  if((reading.Study_App_Lesson_Plan__r.Exam__c == remoteDataService.examInfo.EXAM + ' Exam Part I' && (remoteDataService.examInfo.userExamPart == 1 || remoteDataService.examInfo.userExamPart == 3)) ||
                     (reading.Study_App_Lesson_Plan__r.Exam__c == remoteDataService.examInfo.EXAM + ' Exam Part II' && (remoteDataService.examInfo.userExamPart == 2 || remoteDataService.examInfo.userExamPart == 3))) {

                    var week = 0;
                    var description = "No Topic";
                    week = reading.Study_App_Lesson_Plan__r.Week__c;
                    description = reading.Study_App_Lesson_Plan__r.Description__c;

                    var book = reading.Study_Guide_Domain__r.Name;
                    if(defined(reading,"Book__c"))
                      book = reading.Book__c;

                    var obj = {
                      id: reading.Id,
                      book: { id:"01", title:book, "author":"", "publisher":""},
                      chapter: {id:"", title:reading.Chapter__c, pages:reading.Pages__c},
                      section: { id:"", title:""},
                      desc: reading.Description__c,
                      url: reading.URL__c,
                      exam: reading.Study_App_Lesson_Plan__r.Exam__c,
                      week: { id:reading.Study_App_Lesson_Plan__c, order:week, title:"Week " + week + " - " + description},
                      year: reading.Year__c,
                      topic: { id:reading.Study_Guide_Domain__c, order:reading.Study_Guide_Domain__r.ID__c, title:reading.Study_Guide_Domain__r.Name},
                      attachment : {},
                      sortBook : book,
                      sortChapter : reading.Chapter__c,
                      sortPages : reading.Pages__c,
                      is_An_Online_Reading : reading.Is_Online__c
                    }
                    readObj.readings.push(obj);
                  }
                }
              }
              remoteDataService.readingData.readings = readObj.readings;
              remoteDataService.lessonData = getLessons(remoteDataService.readingData.readings);
            }
            break;

            case 'questionData':
            if(err != NO_FETCH) {

              var questionObj = {
                id: 'frm' + year,
                questions: []
              }
              for(var j=0; j<data.records.length; j++) {
                var question = data.records[j];

                var choices = question.Choices__c.split("\n");

                var obj = {
                  id: question.Id,
                  question:question.Question__c, 
                  reason:question.Rationale__c, 
                  choices:[], 
                  answer: question.Answer__c, 
                  answers : [], 
                  readings : [] 
                }
                for(var k=0; k<choices.length && k<4; k++) {
                  var choice = choices[k].replace("\r","");
                  var cobj = {
                    id: k,
                    description: choice
                  }
                  obj.choices.push(cobj);
                }
                questionObj.questions.push(obj);
              }
              remoteDataService.questionData.questions = questionObj.questions;
            }
            break;

            case 'questionsReadingsData':
            if(err != NO_FETCH) {
              for(var j=0; j<data.records.length; j++) {
                var qr = data.records[j];

                var match = _.findWhere(remoteDataService.questionData.questions, {id: qr.Practice_Exam_Question__c});
                if(match !== null || typeof match !== "undefined") {
                  match.readings.push(qr.Study_Guide_Reading__c);
                }
              }
            }
            break;

            default:
            if(err != NO_FETCH) {
              remoteDataService.userData[propertyName] = data;
            }
            break;
          }
        }
    //remoteDataService.commitData();
    q.resolve();
  });
};



remoteDataService.setMetaData = function(metaItem) {

      // Offline
      if(!isOnline()) {
        localStorage.userSettings = JSON.stringify(remoteDataService.userSettings);
        localStorage.metaData = JSON.stringify(remoteDataService.metaData);
        return;
      }

      if(defined(localStorage,"wasOffLine")) {
        // Ask User to overwrite server or not!
        if (confirm("You were offline last time your data was saved. You are now back online. \n\n Do you want this device's changes to be saved? Click OK to save this devices changes to all devices or click Cancel to use changes from last time you were online.")) {
            // will save data on next commit.
          } else {
            // Clear local device data
            remoteDataService.clearData();
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
          }
          localStorage.removeItem('wasOffLine');   
        }

        var url = '';
        if(navigator.camera) {
          url = serverURL + url;
        }    

        $http.put(url + '/frmApp/user/' + authenticationService.user.contact.Id + '/metaDataItem', metaItem).success(function(data){
          if(defined(data,"Id")) {
            var foundItem = remoteDataService.getReadingByID(data.ReadingId__c);
            if(defined(foundItem) && !defined(foundItem,"id")) {
              foundItem.id=data.Id;
              localStorage.metaData = JSON.stringify(remoteDataService.metaData);
            }
          }
          return;
        }).error(function(data, status, headers, config) {
          //callback(status, null);
        });



      }

      remoteDataService.commitData = function() {

      // Offline
      if(!isOnline()) {
        localStorage.userSettings = JSON.stringify(remoteDataService.userSettings);
        localStorage.metaData = JSON.stringify(remoteDataService.metaData);
        return;
      }

      if(defined(localStorage,"wasOffLine")) {
        // Ask User to overwrite server or not!
        if (confirm("You were offline last time your data was saved. You are now back online. \n\n Do you want this device's changes to be saved? Click OK to save this devices changes to all devices or click Cancel to use changes from last time you were online.")) {
            // will save data on next commit.
          } else {
            // Clear local device data
            remoteDataService.clearData();
            var defer = $q.defer();
            remoteDataService.fetchData(defer, $http);
          }
          localStorage.removeItem('wasOffLine');   
        }


        var url = '';
        if(navigator.camera) {
          url = serverURL + url;
        }    

        $http.put(url + '/frmApp/user/' + authenticationService.user.contact.Id + '/settings', remoteDataService.userSettings).success(function(data){

          if(remoteDataService.userSettings.Id == '')
            remoteDataService.userSettings.Id = data.id;

          localStorage.userSettings = JSON.stringify(remoteDataService.userSettings);

          $http.put(url + '/frmApp/user/' + authenticationService.user.contact.Id + '/metaData', remoteDataService.metaData).success(function(data){

          //remoteDataService.metaData = data;
          localStorage.metaData = JSON.stringify(remoteDataService.metaData);


        }).error(function(data, status, headers, config) {
          //callback(status, null);
        });

      }).error(function(data, status, headers, config) {
        //callback(status, null);
      });
    }

    remoteDataService.clearData = function() {

      localStorage.removeItem('userData');
      remoteDataService.userData = null;

      localStorage.removeItem('metaData');
      remoteDataService.metaData = null;

      localStorage.removeItem('userSettings');
      remoteDataService.userSettings = null;

      localStorage.removeItem('readingData');
      remoteDataService.readingData = null;

      localStorage.removeItem('questionsReadingsData');
      remoteDataService.questionsReadingsData = null;

      localStorage.removeItem('questionData');
      remoteDataService.questionData = null;

      localStorage.removeItem('glossaryData');
      remoteDataService.glossaryData = null;

      localStorage.userSession = {};
    }

    remoteDataService.getMessges = function(callback) {

    // Offline
    if(!isOnline()) {
      if(defined(localStorage,"messages")) {
        callback(null, JSON.parse(localStorage.messages));
      } else {
        callback(404, null);
      }
    } else {

      var url = '/sfdc/exam/' + remoteDataService.userSettings.examId + '/alerts';

      if(navigator.camera) {
        url = serverURL + url;
      }    

      $http({method:'GET',url:url}).success(function(data){

        localStorage.messages=JSON.stringify(data);
        callback(null, data);

      }).error(function(data, status, headers, config) {
          //alert('Could not load messages!');
          callback(status, null);
        });
    }  
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
      remoteDataService.setMetaData(newItem);
    } else {
      foundItem[type]=!foundItem[type];
      remoteDataService.setMetaData(foundItem);
    }

    //remoteDataService.commitData();

    
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

  remoteDataService.resetPassword = function(email){
    return $http.delete("//" + window.location.host + "/frmApp/customer/" + email + "/password")
  }

  return remoteDataService;

}]);