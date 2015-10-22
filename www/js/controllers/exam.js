'use strict';

frmControllers.controller('FRMExamCtrl', ['$scope','$timeout','$location','$sce','examSharedService','remoteDataService','navigationService',
  function($scope,$timeout,$location,$sce,examSharedService,remoteDataService,navigationService) {

    $scope.userData = remoteDataService.userData;

    $scope.currentQuestion = 0;
    $scope.settings = examSharedService.settings;
    $scope.questions = examSharedService.questions;
    
    $scope.question = examSharedService.questions[$scope.currentQuestion];
    $scope.htmlString = $sce.trustAsHtml($scope.question.question.replace(/https:\/\/([^\/]*)\/servlet/,+"/servlet"));

    $scope.totalQuestions = examSharedService.questions.length;
    $scope.answers = $scope.question.answers;
    $scope.choices = $scope.question.choices;
    $scope.answerResponse = "";
    $scope.answerReason = "";

    $scope.correctAnswers = 0;
    $scope.wrongAnswers=0;
    $scope.skipQuestions = 0;
    $scope.flaggedQuestions = 0;

    $scope.flagged=false;
    $scope.elapsedTime = 0;
    $scope.elapsedTimeStart = 0;
    $scope.elapsedTimeEnd = 0;

    $scope.userAnswers = [];

    examSharedService.resetData();

    $timeout(function() {
      navigationService.pageTransitionIn();
      $scope.elapsedTimeStart = (new Date).getTime();
    }, 0);


    $scope.exitExam = function() {
      $('body').removeClass("modal-open");
      //document.location.hash = '#/dash';
      navigationService.changeView('dashboard');
    }

    $scope.chooseAnswer = function(id) {

      var userAnswer = {};
      userAnswer.question = $scope.question;
      userAnswer.choice = id;

      $scope.elapsedTimeEnd = (new Date).getTime();
      userAnswer.elapsedTime = ($scope.elapsedTimeEnd - $scope.elapsedTimeStart)

      if($scope.question.answer == id) {
        $scope.correct = true;
        $scope.answerResponse = "Correct!";
        $scope.correctAnswer = "";
        $scope.answerReason = "Keep it up.";
        $scope.correctAnswers++;
      } else {
        $scope.correct = false;
        $scope.wrongAnswers++;
        $scope.answerResponse = "Sorry, that is not right.";
        $scope.correctAnswer = $scope.question.answer;

        $scope.answerReason = $scope.question.reason;
        $scope.answerReason = $scope.answerReason.replace(/:+/g,'<br>');
      }
      if(examSharedService.settings.mode == 0) {
        $("#myModal").modal();
      } else {
        $scope.nextQuestion();
      }

      userAnswer.correct = $scope.correct;
      userAnswer.flagged = $scope.flagged;
      $scope.userAnswers.push(userAnswer);
      $scope.flagged=false;
      $scope.elapsedTime=0;
    }

    $scope.getCurrentReason = function() {
      return $sce.trustAsHtml($scope.question.reason.replace(/https:\/\/([^\/]*)\/servlet/,+"/servlet"));
    }


    $scope.prevQuestion=function() {

      if($scope.userAnswers.length > 0) {
        var answer = $scope.userAnswers.pop()

        if(answer.correct == true) {
          $scope.correctAnswers--;    
        } else if(answer.correct == false) {
          $scope.wrongAnswers--;
        } else {
          $scope.skipQuestions--;
        }

        if($scope.flagged) {
          $scope.flaggedQuestions--;
        }
      }

      examSharedService.userAnswers = $scope.userAnswers;
      examSharedService.correctAnswers = $scope.correctAnswers;
      examSharedService.skipQuestions = $scope.skipQuestions;
      examSharedService.wrongAnswers = $scope.wrongAnswers;
      examSharedService.flaggedQuestions = $scope.flaggedQuestions;
      
      $scope.currentQuestion--;
      $scope.question = examSharedService.questions[$scope.currentQuestion];
      $scope.htmlString = $sce.trustAsHtml($scope.question.question.replace(/https:\/\/([^\/]*)\/servlet/,+"/servlet"));

      $scope.choices = $scope.question.choices;

      $scope.flagged=false;
      $scope.elapsedTime=0;
      $scope.elapsedTimeStart = (new Date).getTime();
    }


    $scope.skipQuestion=function() {

      var userAnswer = {};
      userAnswer.question = $scope.question;
      userAnswer.choice = null;
      userAnswer.correct = null;

      $scope.userAnswers.push(userAnswer);

      $scope.skipQuestions++;
      examSharedService.skipQuestions = $scope.skipQuestions;

      $scope.flagged=false;
      $scope.elapsedTime=0;

      $scope.nextQuestion();
    }


    $('#myModal').on('hidden.bs.modal', function (e) {
      // do something...
      if($scope.currentQuestion == $scope.totalQuestions) {
         navigationService.changeView('examresults');
      }
    })


    $scope.changeView = function(view) {
      navigationService.changeView(view);
    }

    var gotoQuestion=function() {
      if($scope.currentQuestion == $scope.totalQuestions-1) {

        navigationService.pageTransitionOut();
        examSharedService.userAnswers = $scope.userAnswers;
        examSharedService.correctAnswers = $scope.correctAnswers;

        if(examSharedService.settings.mode == 1) {
          navigationService.changeView('examresults');
        } else {
          $scope.currentQuestion++;  
        }
        
      } else {
        $scope.currentQuestion++;
        $scope.question = examSharedService.questions[$scope.currentQuestion];
        $scope.htmlString = $sce.trustAsHtml($scope.question.question.replace(/https:\/\/([^\/]*)\/servlet/,salesForcePublicURL+"/servlet"));
        
        $scope.answers = $scope.question.answers;
        $scope.choices = $scope.question.choices;
        $scope.answerResponse = "";
        $scope.answerReason = "";      
        $scope.flagged=false;
        $scope.elapsedTime=0;
        $scope.elapsedTimeStart = (new Date).getTime();
      }
    }

    $scope.nextQuestion = function() {

      if(examSharedService.settings.mode == 0) {
        $('#myModal').modal('hide');
          gotoQuestion();
      } else {
        gotoQuestion();
      }

    }

    $scope.flagQuestion = function() {
      
      $scope.flaggedQuestions++;
      $scope.flagged=true;
      examSharedService.flaggedQuestions = $scope.flaggedQuestions;

      for(var i=0; i < $scope.question.readings.length; i++) {

        var id = $scope.question.readings[i];
        var type = 'flagged';
        var found = 0;
        var foundItem = _.findWhere(remoteDataService.metaData, {readingId: id});
        if(foundItem === null || typeof foundItem === "undefined") {
          var newItem = {readingId: id};
          newItem[type] = true;
          remoteDataService.metaData.push(newItem);
          remoteDataService.setMetaData(newItem);
        } else {
          foundItem[type]=true;
        }

      }
      alert('Question has been flagged.');
    }

  }
]);