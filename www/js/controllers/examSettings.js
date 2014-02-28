frmControllers.controller('FRMExamSettingsCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService','navigationService',
  function($scope,$timeout,$location,examSharedService,remoteDataService,navigationService) {

    $scope.settings = {
      mode:0,
      topics:0,
      questions:1
    }

    $timeout(function() {
      navigationService.pageTransitionIn();
    }, 0);

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
          var questions = remoteDataService.questionData;
          // _.reject(remoteDataService.questionData, function(question) { 
          //   var inter = _.intersection(readingsIds, question.readings)
          //   return inter.length == 0; 
          // });

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


      if(examSharedService.questions.length == 0) {
        $("#myModal").modal();
      } else {
        $location.path('/exam');  
      }
      
    }


  }
]);