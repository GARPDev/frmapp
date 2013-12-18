'use strict';

function tellAngular() {
    console.log("tellAngular call");
    var domElt = document.getElementById('view-container');
    var scope = angular.element(domElt).scope();
    scope.$apply(function() {
        scope.width = window.innerWidth;
        scope.height = window.innerHeight;
    });
    var nhRead = window.innerHeight - 240;
    var nhMsg = window.innerHeight - 430;
    $(".readingscrollregion").css("height", nhRead + "px");
    $(".msgscrollregion").css("height", nhMsg + "px");
}


//first call of tellAngular when the dom is loaded
document.addEventListener("DOMContentLoaded", tellAngular, false);

//calling tellAngular on resize event
window.onresize = tellAngular;


/* Controllers */
var frmControllers = angular.module('frmControllers', []);

frmControllers.controller('NavController', ['$scope', '$location',
  function($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };    
  }
]);

frmControllers.controller('FRMAppLoginCtrl', ['$scope', '$location','remoteDataService',
  function($scope, $location, remoteDataService) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    $scope.clearData = function() {
      remoteDataService.clearData();
    }
  }
]);

frmControllers.controller('FRMAppMyAccountCtrl', ['$scope', '$location','remoteDataService',
  function($scope, $location, remoteDataService) {

    $scope.nav = navigator.appCodeName;
    $scope.camera =  navigator.camera;
    $scope.deviceReady =  false;
    $scope.camerror = "";
    $scope.camdata = "";
    $scope.pictureSource = pictureSource;
    $scope.destinationType = destinationType;

    $scope.takePhoto = function () { 
      if(navigator.camera !== null && typeof navigator.camera !== "undefined") {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
      } else {
        onFail('navigator.camera not defined!');
      }
    };

    function onPhotoFileSuccess(imageData) {
      // Get image handle
      //alert(JSON.stringify(imageData));
      //$scope.camdata=imageData.length;
      $("#userImage").attr("src",imageData);

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      //smallImage.src = imageData;
    };

    function onFail(message) {
      $scope.camerror=message;
      //alert('Failed because: ' + message);
    }
  }
]);



frmControllers.controller('ScheduleBarController', ['$scope', '$location','Readings', 'Messages','Lessons','scheudlarBarSharedService','remoteDataService',
  function($scope, $location, Readings, Messages, Lessons, scheudlarBarSharedService, remoteDataService) {

    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;

  	$scope.isActive = function (viewLocation) { 
          return viewLocation === $location.path();
      };
  	
  	$scope.itemSelect = function(item) {
  		$scope.selected = item;
  		scheudlarBarSharedService.selectItem(item);
      };

  	$scope.isItemSelected = function(item) {
  		if(item == $scope.selected) {
  			return 1;
  		} else {
  			return 0;
  		}
  	};

    $scope.filterMatch = function( criteria ) {
      return function( item ) {
        var li = scheudlarBarSharedService.lessonIndex;
        return $scope.lessons[li].readings[criteria.index][criteria.field] == criteria.value;
      };
    };
    
  	$scope.$on('handleDoneReadingItem', function() {
  		var li = scheudlarBarSharedService.lessonIndex;
  		var ri = scheudlarBarSharedService.readingIndex;
  		
  		if($scope.lessons[li].readings[ri].checked) {
  			$scope.lessons[li].readings[ri].checked = 0;
  		} else {
  			$scope.lessons[li].readings[ri].checked = 1;
  		}
  	});
  	
  	$scope.isItemInProgress = function(id) {

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
  	};

  	$scope.isItemDone = function(id) {
      var lesson = _.findWhere(remoteDataService.lessonData, {id: id});

      if(lesson !== null && typeof lesson !== "undefined") {

        var readings = lesson.readings;
        var readingsIds = _.pluck(readings, 'id');

        var meta = _.where(remoteDataService.userMeta, {checked: true});
        if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
          var metaIds = _.pluck(meta, 'id');
          var inter = _.intersection(readingsIds,metaIds)

          if(inter.length == readingsIds.length)
            return true
          else return false;

        } else {
          return false;
        }

      } else {
        return false;
      }
    }
  }
]);


frmControllers.controller('FRMAppReadingsListCtrl', ['$scope','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, scheudlarBarSharedService, remoteDataService, readlingListSharedService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;


    // Readings List
    $scope.itemClicked = function (id, type) {

      readlingListSharedService.setReadingIndex(id);

      // New Queue
      var found = 0;
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: id});
      if(foundItem === null || typeof foundItem === "undefined") {
        var newItem = {id: id};
        newItem[type] = true;
        remoteDataService.userMeta.push(newItem);
      } else {
        foundItem[type]=!foundItem[type];
      }

      remoteDataService.commitData();
    };
  
    $scope.isItemClicked = function (id, type) { 

      // New Queue
      var found = 0;
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: id});
      if(foundItem === null || typeof foundItem === "undefined") {
        return false;
      } else {
        return foundItem[type];
      }

    }

    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;;
    }

    $scope.getNumberOfNotes = function(id) {
      var found = 0;
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: id});
      if(foundItem !== null && typeof foundItem !== "undefined" &&
        foundItem.notes !== null && typeof foundItem.notes !== "undefined") {
        return foundItem.notes.length;
      } else {
        return 0;
      }
    }

    $scope.criteriaMatch = function(value) {
      return function( item ) {

        // New Queue  
        var foundItem = _.findWhere(remoteDataService.userMeta, {id: item.id});        

        if(foundItem !== null && typeof foundItem !== "undefined") {

          if(readlingListSharedService.filters.flagged && readlingListSharedService.filters.checked) {
            return (foundItem.flagged === true && foundItem.checked === true);
          } else if(readlingListSharedService.filters.flagged) {
            return foundItem.flagged === true;
          } else if(readlingListSharedService.filters.checked) {
            return foundItem.checked === true;
          } else {
            return 1;  
          }
        } else {
          if(readlingListSharedService.filters.flagged || readlingListSharedService.filters.checked) {
            return false;
          } else {
            return 1;  
          }
          
        }
        
      }
    }   

    $scope.$on('handleSelectItem', function() {
      if($scope.lessonIndex != scheudlarBarSharedService.lessonIndex) {
        $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;
        $('.readings-list-area').hide("fast", function() {
          $('.readings-list-area').show("fast", function() {
          //alert( "Animation complete." );
          });
        });
      }      

  });       


  }
]);


frmControllers.controller('FRMReadingsCtrl', ['$scope','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, scheudlarBarSharedService, remoteDataService,readlingListSharedService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;
    $scope.currentReading=null;

    // For Readings
    $scope.selectedReadingArray = [];
    $scope.filterList = function(filterType,value) {
      readlingListSharedService.filterList(filterType);      
    }

    $scope.getSelectedLesson = function ($index) { 
      var li = scheudlarBarSharedService.lessonIndex;
      return $scope.lessons[li].readings[$index];
    }

    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;
    }


    $scope.isFilterOn = function(type) {
      return readlingListSharedService.filters[type];
    }

  }
]);


frmControllers.controller('FRMAppDashCtrl', ['$scope', 'Readings', 'Messages','Lessons','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, Readings, Messages, Lessons, scheudlarBarSharedService, remoteDataService, readlingListSharedService) {
  
  	//$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.messages = Messages.query();
  	$scope.lessonIndex = scheudlarBarSharedService.lessonIndex;

    readlingListSharedService.clearFilters();

    // Init height;
    var nhRead = window.innerHeight - 240;
    var nhMsg = window.innerHeight - 430;
    $(".readingscrollregion").css("height", nhRead + "px");
    $(".msgscrollregion").css("height", nhMsg + "px");

    
    $scope.go = function() {
      $scope.msgread = 'msgread';
    }
    
    // For Messages
    $scope.selectedMessageArray = [];

    $scope.getSelectedLesson = function ($index) { 
      var li = scheudlarBarSharedService.lessonIndex;
      return $scope.lessons[li].readings[$index];
    }
   
    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;;
    }

  }
]);

frmControllers.controller('FRMExamSettingsCtrl', ['$scope','$location','examSharedService','remoteDataService',
  function($scope,$location,examSharedService,remoteDataService) {

    $scope.settings = {
      mode:0,
      topics:0,
      questions:1
    }

    $scope.isSettingOn = function(type, value) {
      return $scope.settings[type] === value;
    }

    $scope.saveSettings = function() {
      examSharedService.settings = $scope.settings;

      // Complie Questions
      var finalQuestions = [];
      switch($scope.settings.topics)
      {
        case 0:  // Everything I have learned so far
          var readings = _.where(remoteDataService.userMeta, {checked: true});
          var readingsIds = _.pluck(readings, 'id');
          var questions = _.reject(remoteDataService.questionData, function(question) { 
            var inter = _.intersection(readingsIds, question.readings)
            return inter.length == 0; 
          });

          var maxQuestions = $scope.settings.questions;
          if(questions.length < maxQuestions)
            maxQuestions = questions.length;

          for(var i=0; i<maxQuestions; i++) {
            var index = Math.floor(Math.random() * (maxQuestions-i));
            finalQuestions.push(questions[index]);
            questions.splice(index,1);
          }

          examSharedService.questions = finalQuestions;
        break;


        case 1:  // My Trouble Everything Areas
          var readings = _.where(remoteDataService.userMeta, {flagged: true});
          var readingsIds = _.pluck(readings, 'id');
          var questions = _.reject(remoteDataService.questionData, function(question) { 
            var inter = _.intersection(readingsIds, question.readings)
            return inter.length == 0; 
          });

          var maxQuestions = $scope.settings.questions;
          if(questions.length < maxQuestions)
            maxQuestions = questions.length;

          for(var i=0; i<maxQuestions; i++) {
            var index = Math.floor(Math.random() * (maxQuestions-i));
            finalQuestions.push(questions[index]);
            questions.splice(index,1);
          }

          examSharedService.questions = finalQuestions;        
        break;


        case 2:  // By Section

          var readingQuestions = [];
          for(var i=0; i<remoteDataService.lessonData.length; i++) {

            var lesson = remoteDataService.lessonData[i];

            if(lesson !== null && typeof lesson !== "undefined") {

              var readings = lesson.readings;
              var readingsIds = _.pluck(readings, 'id');

              var meta = _.where(remoteDataService.userMeta, {checked: true});
              if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
                var metaIds = _.pluck(meta, 'id');
                var inter = _.intersection(readingsIds,metaIds)

                if(inter.length > 0) {

                  for(var j=0; j<lesson.readings.length; j++) {
                    readingQuestions.push(lesson.readings[j]);
                  }

                }
              }
            } 
          }

          var readingsIds = _.pluck(readingQuestions, 'id');
          var questions = _.reject(remoteDataService.questionData, function(question) { 
            var inter = _.intersection(readingsIds, question.readings)
            return inter.length == 0; 
          });

          var maxQuestions = $scope.settings.questions;
          if(questions.length < maxQuestions)
            maxQuestions = questions.length;

          for(var i=0; i<maxQuestions; i++) {
            var index = Math.floor(Math.random() * (maxQuestions-i));
            finalQuestions.push(questions[index]);
            questions.splice(index,1);
          }

          examSharedService.questions = finalQuestions;                  
        break;


        case 3:  // Everything
          var readingQuestions = [];
          for(var i=0; i<remoteDataService.lessonData.length; i++) {

            var lesson = remoteDataService.lessonData[i];

            if(lesson !== null && typeof lesson !== "undefined") {
              for(var j=0; j<lesson.readings.length; j++) {
                readingQuestions.push(lesson.readings[j]);
              }
            } 
          }

          var readingsIds = _.pluck(readingQuestions, 'id');
          var questions = _.reject(remoteDataService.questionData, function(question) { 
            var inter = _.intersection(readingsIds, question.readings)
            return inter.length == 0; 
          });

          var maxQuestions = $scope.settings.questions;
          if(questions.length < maxQuestions)
            maxQuestions = questions.length;

          for(var i=0; i<maxQuestions; i++) {
            var index = Math.floor(Math.random() * (maxQuestions-i));
            finalQuestions.push(questions[index]);
            questions.splice(index,1);
          }

          examSharedService.questions = finalQuestions;                  
        break;
      }

      $location.path('/exam');
    }


  }
]);


frmControllers.controller('FRMExamDayCtrl', ['$scope','$location','examSharedService','remoteDataService',
  function($scope,$location,examSharedService,remoteDataService) {

    $('.tab-pane').hide();
    $('#tab1').show();

    

    $scope.tabToItem = function(item) {
      $('.tab-pane').hide();
      $('#examday-tabs li').removeClass('active');
      $('#' + item).show();
      $('#tab_' + item).addClass('active');
    }

  }
]);


frmControllers.controller('FRMExamResultsCtrl', ['$scope','$location','examSharedService','remoteDataService',
  function($scope,$location,examSharedService,remoteDataService) {

    $scope.userAnswers = examSharedService.userAnswers;
    $scope.correctAnswers = examSharedService.correctAnswers;
    $scope.totalQuestions = examSharedService.questions.length;

  }
]);


frmControllers.controller('FRMExamCtrl', ['$scope','$location','examSharedService','remoteDataService',
  function($scope,$location,examSharedService,remoteDataService) {

    $scope.currentQuestion = 0;
    $scope.settings = examSharedService.settings;
    $scope.questions = examSharedService.questions;
    $scope.question = examSharedService.questions[$scope.currentQuestion];
    $scope.totalQuestions = examSharedService.questions.length;
    $scope.answers = $scope.question.answers;
    $scope.choices = $scope.question.choices;
    $scope.answerResponse = "";
    $scope.answerReason = "";

    $scope.correctAnswers = 0;

    $scope.userAnswers = [];

    $scope.chooseAnswer = function(id) {

      var userAnswer = {};
      userAnswer.question = $scope.question;
      userAnswer.choice = id;

      $scope.userAnswers.push(userAnswer);

      if($scope.question.answer == id) {
        $scope.answerResponse = "Correct!";
        $scope.correctAnswer = "";
        $scope.answerReason = "Keep it up.";
        $scope.correctAnswers++;
      } else {
        $scope.answerResponse = "Sorry, that is not right.";
        $scope.correctAnswer = $scope.question.answer;
        $scope.answerReason = $scope.question.reason;
      }
      if(examSharedService.settings.mode == 0) {
        $("#myModal").modal();
      } else {
        $scope.nextQuestion();
      }
    }

    $scope.nextQuestion = function() {

      if(examSharedService.settings.mode == 0) {
        $('#myModal').modal('hide')
      }

      if($scope.currentQuestion == $scope.totalQuestions-1) {
        examSharedService.userAnswers = $scope.userAnswers;
        examSharedService.correctAnswers = $scope.correctAnswers;

        $location.path('/examresults');
      } else {
        $scope.currentQuestion++;
        $scope.question = examSharedService.questions[$scope.currentQuestion];
        $scope.answers = $scope.question.answers;
        $scope.choices = $scope.question.choices;
        $scope.answerResponse = "";
        $scope.answerReason = "";              
      }
    }

    $scope.flagQuestion = function() {
      
      for(var i=0; i < $scope.question.readings.length; i++) {

        var id = $scope.question.readings[i];
        var type = 'flagged';
        var found = 0;
        var foundItem = _.findWhere(remoteDataService.userMeta, {id: id});
        if(foundItem === null || typeof foundItem === "undefined") {
          var newItem = {id: id};
          newItem[type] = true;
          remoteDataService.userMeta.push(newItem);
        } else {
          foundItem[type]=true;
        }

      }
    }

  }
]);

frmControllers.controller('ExamNavController', ['$scope','examSharedService',
  function($scope,examSharedService) {

    $scope.currentQuestion = 0;
    $scope.totalQuestions = examSharedService.settings.questions;

    $scope.isSettingOn = function(type, value) {
      return $scope.settings[type] === value;
    }


  }
]);



frmControllers.controller('FRMNotesCtrl', ['$scope','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope,scheudlarBarSharedService,remoteDataService,readlingListSharedService) {
    
    $scope.notes = [];
    $scope.currentReading = null;

    $scope.$on('handleSetReadingIndex', function() {

      var li = scheudlarBarSharedService.lessonIndex;
      var readings = remoteDataService.lessonData[li].readings;

      var found = 0;
      var foundItem = _.findWhere(readings, {id: readlingListSharedService.readingIndex});
      if(foundItem)
        $scope.currentReading = foundItem;
      else $scope.currentReading = null;


      $scope.notes = [];
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        if(foundItem.notes !== null && typeof foundItem.notes !== "undefined") {
          $scope.notes = foundItem.notes;
        }
      }
    });

    $scope.addNote = function(note) {
      //$scope.notes.push(note);
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        if(foundItem.notes === null || typeof foundItem.notes === "undefined") {
          foundItem.notes=[];
        }
        foundItem.notes.push(note);
        $scope.notes = foundItem.notes;
      }
      remoteDataService.commitData();
      $('#addNote').val('');
    }

    $scope.deleteNote = function(note) {
      var foundItem = _.findWhere(remoteDataService.userMeta, {id: readlingListSharedService.readingIndex});
      if(foundItem !== null && typeof foundItem !== "undefined") {
        var foundNote = _.indexOf(foundItem.Notes, note);        
        if(foundNote !== null && typeof foundNote !== "undefined") {
          foundItem.notes.splice(foundNote,1);
          $scope.notes = foundItem.notes;
          remoteDataService.commitData();
        }
        
      }

    }

  }
]);


/*
frmControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
*/