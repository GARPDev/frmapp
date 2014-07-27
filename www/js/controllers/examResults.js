frmControllers.controller('FRMExamResultsCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService','navigationService',
  function($scope,$timeout,$location,examSharedService,remoteDataService,navigationService) {

    $scope.userAnswers = examSharedService.userAnswers;
    $scope.correctAnswers = examSharedService.correctAnswers;
    $scope.wrongAnswers = examSharedService.wrongAnswers;
    $scope.skipQuestions = examSharedService.skipQuestions;
    $scope.flaggedQuestions = examSharedService.flaggedQuestions;

    $scope.totalQuestions = examSharedService.questions.length;
    $scope.settings = examSharedService.settings;

    $scope.currentOpen = '';
    $scope.results = true;
    $scope.wrongAnswers = ($scope.totalQuestions-$scope.correctAnswers-$scope.skipQuestions);

    $scope.totalTime=0;
    for(var i=0; i<$scope.userAnswers.length; i++) {
      $scope.totalTime+=$scope.userAnswers.elapsedTime;
    }
    $scope.avgTime = $scope.userAnswers.length/($scope.totalTime/1000/60);


    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open");
    }, 0);

    $scope.calcCorrect = function() {
      return formatNumber(($scope.correctAnswers/$scope.totalQuestions)*100,0)
    }

    $scope.formatTime = function(time) {
      var hours = Math.floor($scope.totalTime/1000/60/60);
      var minutes = Math.floor(($scope.totalTime - (hours *60*60*1000)) /1000/60);
      var secs = Math.floor(($scope.totalTime - (hours *60*60*1000) - (minutes *60*1000) ) / 1000)

      if(hours.length < 2) { hours = "0" + hours}
      if(minutes.length < 2) { minutes = "0" + minutes}
      if(secs.length < 2) { secs = "0" + secs}

      return hours + ":" + minutes + ":" + secs
    }

    $scope.gotoQuestion = function(index) {
      document.location.hash = '#!/examresultsquestion?questionIdx=' + index;
    }

    $scope.formatNumber = function(amount, percision) {
      return formatNumber(amount, percision);
    }

    $scope.reTake = function() {
      $('body').removeClass("modal-open");
      document.location.hash = '#!/exam';
      //navigationService.changeView('dash');
    }

    $scope.exitExam = function() {
      $('body').removeClass("modal-open");
      document.location.hash = '#!/dashboard';
      //navigationService.changeView('dash');
    }


    $scope.showQuestion=function(id) {

      // Close All
      //$('#accordian .panel-collapse').removeClass('collapse.in').addClass('collapse')
      if($scope.currentOpen.length > 0)
        $('#' + $scope.currentOpen).collapse('hide');

      // Open id
      //$('#' + id).removeClass('collapse').addClass('collapse.in');
      $('#' + id).collapse('show');

      $scope.currentOpen = id;
    }

  }
]);