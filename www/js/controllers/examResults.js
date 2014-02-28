frmControllers.controller('FRMExamResultsCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService','navigationService',
  function($scope,$timeout,$location,examSharedService,remoteDataService,navigationService) {

    $scope.userAnswers = examSharedService.userAnswers;
    $scope.correctAnswers = examSharedService.correctAnswers;
    $scope.wrongAnswers = examSharedService.wrongAnswers;
    $scope.skipQuestions = examSharedService.skipQuestions;
    $scope.totalQuestions = examSharedService.questions.length;
    $scope.settings = examSharedService.settings;

    $scope.currentOpen = '';
    $scope.results = true;
    $scope.wrongAnswers = ($scope.totalQuestions-$scope.correctAnswers-$scope.skipQuestions);

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open");
    }, 0);

    $scope.exitExam = function() {
      $('body').removeClass("modal-open");
      document.location.hash = '#/dashboard';
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