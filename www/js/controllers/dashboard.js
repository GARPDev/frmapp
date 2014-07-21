'use strict';

frmControllers.controller('FRMAppDashboardCtrl', ['$scope', '$timeout','$http','Readings', 'Messages','Lessons','scheduleBarSharedService','remoteDataService','readlingListSharedService','navigationService',
  function($scope, $timeout, $http, Readings, Messages, Lessons, scheduleBarSharedService, remoteDataService, readlingListSharedService, navigationService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.userData = remoteDataService.userData;
    $scope.metaData = remoteDataService.metaData;

    //$scope.messages = remoteDataService.messages;

    $scope.doneItems = [];

    $scope.percentCompleteTotals = remoteDataService.getPercentCompleteTotals();

    $timeout(function() {
      navigationService.pageTransitionIn();
    }, 0);

    var url = '/frmApp/exam/' + remoteDataService.userData.settings.examId + '/msg';
    if(navigator.camera) {
      url = serverURL + url;
    }    

    $http({method:'GET',url:url}).success(function(data){

      $scope.messages = data;

    }).error(function(data, status, headers, config) {
        alert('Could not load messages!');
    });


    $scope.flaggedMatch = function(value) {
      return function( item ) {

        // find meta  
        var foundItem = _.findWhere(remoteDataService.metaData, {readingId: item.id});        

        if(foundItem !== null && typeof foundItem !== "undefined") {
          return foundItem.flagged;
        }
      }
    }

    $scope.lessonInProgressMatch = function(value) {
      return function( item ) {
        if(!value)
          return !remoteDataService.isLessonInProgress(item.id);
        else return remoteDataService.isLessonInProgress(item.id);

      }
    }

    $scope.navToLessonReadings = function(id) {
      scheduleBarSharedService.selectItem(id);
      navigationService.changeView('readings');
    }

    $scope.removeFlag = function(id) {
      remoteDataService.toggelReadingAttribute(id, 'flagged');
    }

    $scope.getEpochDateTimeText = function(epochDate) {
      return getEpochDateTimeText(epochDate);
    }

  }
]);
