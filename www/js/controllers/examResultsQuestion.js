'use strict';

frmControllers.controller('FRMExamResultsQuestionCtrl', ['$scope','$timeout','$location','$sce','$routeParams','examSharedService','remoteDataService','navigationService',
  function($scope,$timeout,$location,$sce,$routeParams,examSharedService,remoteDataService,navigationService) {

    $scope.userData = remoteDataService.userData;

    $scope.currentQuestion = $routeParams.questionIdx;
    $scope.settings = examSharedService.settings;
    $scope.questions = examSharedService.questions;
    $scope.question = examSharedService.questions[$scope.currentQuestion];
    
    $scope.userAnswer = examSharedService.userAnswers[$routeParams.questionIdx];

    $scope.userChoice = _.findWhere($scope.userAnswer.question.answers, {id: $scope.userAnswer.choice});        
    $scope.correctChoice = _.findWhere($scope.userAnswer.question.answers, {id: $scope.userAnswer.question.answer});        


    $scope.totalQuestions = examSharedService.questions.length;
    $scope.answers = $scope.question.answers;
    $scope.choices = $scope.question.choices;
    $scope.answerResponse = "";
    $scope.answerReason = "";

    $scope.correctAnswers = 0;
    $scope.wrongAnswers=0;
    $scope.skipQuestions = 0;

    //$scope.userAnswers = [];

    //examSharedService.resetData();

    $timeout(function() {
      navigationService.pageTransitionIn();
    }, 0);

    $scope.returnResults = function() {
      navigationService.changeView('examresults');
    }

    $scope.exitExam = function() {
      $('body').removeClass("modal-open");
      //document.location.hash = '#/dash';
      navigationService.changeView('dashboard');
    }

    $scope.inAnswer = function(choice, answer) {
      var ans = answer.replace(",","");
      ans = ans.replace("and","");
      var opt = ans.split(" ");
      for(var i=0; i<opt.length; i++) {
        if(opt[i] == choice)
          return true;
      }
      return false;
    }

    $scope.chooseAnswer = function(id) {

      var userAnswer = {};
      userAnswer.question = $scope.question;
      userAnswer.choice = id;

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
      }
      if(examSharedService.settings.mode == 0) {
        $("#myModal").modal();
      } else {
        $scope.nextQuestion();
      }

      userAnswer.correct = $scope.correct;
      $scope.userAnswers.push(userAnswer);

    }

    $scope.getCurrentReason = function() {
       return $sce.trustAsHtml($scope.answerReason);
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
      }

      examSharedService.userAnswers = $scope.userAnswers;
      examSharedService.correctAnswers = $scope.correctAnswers;
      examSharedService.skipQuestions = $scope.skipQuestions;
      examSharedService.wrongAnswers = $scope.wrongAnswers;
      
      $scope.currentQuestion--;
      $scope.question = examSharedService.questions[$scope.currentQuestion];

    }


    $scope.skipQuestion=function() {

      var userAnswer = {};
      userAnswer.question = $scope.question;
      userAnswer.choice = null;
      userAnswer.correct = null;
      $scope.userAnswers.push(userAnswer);

      $scope.skipQuestions++;
      examSharedService.skipQuestions = $scope.skipQuestions;
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
        $scope.answers = $scope.question.answers;
        $scope.choices = $scope.question.choices;
        $scope.answerResponse = "";
        $scope.answerReason = "";              
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
      
      for(var i=0; i < $scope.question.readings.length; i++) {

        var id = $scope.question.readings[i];
        var type = 'flagged';
        var found = 0;
        var foundItem = _.findWhere(remoteDataService.metaData, {readingId: id});
        if(foundItem === null || typeof foundItem === "undefined") {
          var newItem = {id: id};
          newItem[type] = true;
          remoteDataService.metaData.push(newItem);
        } else {
          foundItem[type]=true;
        }

      }
    }

  }
]);