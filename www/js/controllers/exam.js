'use strict';

frmControllers.controller('FRMExamCtrl', ['$scope','$timeout','$location','$sce','examSharedService','remoteDataService','navigationService',
  function($scope,$timeout,$location,$sce,examSharedService,remoteDataService,navigationService) {

    $scope.userData = remoteDataService.userData;

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
    $scope.wrongAnswers=0;
    $scope.skipQuestions = 0;
    $scope.flaggedQuestions = 0;

    $scope.flagged=false;
    $scope.elapsedTime = 0;

    $scope.userAnswers = [];

    examSharedService.resetData();

    $timeout(function() {
      navigationService.pageTransitionIn();
      display_c(86501);
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
      userAnswer.flagged = $scope.flagged;
      userAnswer.elapsedTime = $scope.elapsedTime;
      $scope.userAnswers.push(userAnswer);
      $scope.flagged=false;
      $scope.elapsedTime=0;
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

      $scope.flagged=false;
      $scope.elapsedTime=0;
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
        $scope.answers = $scope.question.answers;
        $scope.choices = $scope.question.choices;
        $scope.answerResponse = "";
        $scope.answerReason = "";      
        $scope.flagged=false;
        $scope.elapsedTime=0;
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
          var newItem = {id: id};
          newItem[type] = true;
          remoteDataService.metaData.push(newItem);
        } else {
          foundItem[type]=true;
        }

      }
      alert('Question has been flagged.');
    }


    function display_c(start){
        window.start = parseFloat(start);
        var end = 0 // change this to stop the counter at a higher value
        var refresh=1000; // Refresh rate in milli seconds
        if(window.start >= end ){
            mytime=setTimeout('display_ct()',refresh)
        } else {
            alert("Time Over ");
        }
    }

    function display_ct() {
        // Calculate the number of days left
        var days=Math.floor(window.start / 86400);
        // After deducting the days calculate the number of hours left
        var hours = Math.floor((window.start - (days * 86400 ))/3600)
        // After days and hours , how many minutes are left
        var minutes = Math.floor((window.start - (days * 86400 ) - (hours *3600 ))/60)
        // Finally how many seconds left after removing days, hours and minutes.
        var secs = Math.floor((window.start - (days * 86400 ) - (hours *3600 ) - (minutes*60)))

        var x = window.start + "(" + days + " Days " + hours + " Hours " + minutes + " Minutes and " + secs + " Secondes " + ")";


        //document.getElementById('ct').innerHTML = x;

        $scope.elapsedTime = secs;

        window.start= window.start- 1;
        tt=display_c(window.start);
    }

    function stop() {
        clearTimeout(mytime);
    }



  }
]);