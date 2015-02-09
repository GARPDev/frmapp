frmControllers.controller('ExamNavController', ['$scope','examSharedService',
  function($scope,examSharedService) {

    $scope.currentQuestion = 0;
    $scope.totalQuestions = examSharedService.settings.questions;
    $scope.settings = examSharedService.settings;

    $scope.isSettingOn = function(type, value) {
      return $scope.settings[type] === value;
    }


  }
]);
