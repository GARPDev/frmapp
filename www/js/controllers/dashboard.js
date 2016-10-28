'use strict';

frmControllers.controller('FRMAppDashboardCtrl', ['$scope', '$timeout','$http','Readings', 'Messages','Lessons','scheduleBarSharedService','remoteDataService','readlingListSharedService','navigationService','authenticationService',
  function($scope, $timeout, $http, Readings, Messages, Lessons, scheduleBarSharedService, remoteDataService, readlingListSharedService, navigationService, authenticationService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.allReadings = _.flatten(_.pluck($scope.lessons,'readings'));
    $scope.userData = remoteDataService.userData;
    $scope.metaData = remoteDataService.metaData;
    $scope.doneItems = [];
    $scope.percentCompleteTotals = remoteDataService.getPercentCompleteTotals();
    $scope.userExam = authenticationService.user.contact.KPI_Current_Exam_Registration__c;
    $scope.userImage = $scope.userData.FullPhotoUrl + '?oauth_token=' + $scope.userData.accessToken;
    $scope.userSettings = remoteDataService.userSettings;
    
    if(defined(remoteDataService,"examInfo.userExam.Defered__c") && remoteDataService.examInfo.userExam.Defered__c != 'Pending') {
      var mdate = moment(remoteDataService.examInfo.userExam.Exam_Site__r.Exam__r.Exam_Date__c);
      var now = moment();
      $scope.days = mdate.diff(now, 'days');      
    }

    $timeout(function() {
      navigationService.pageTransitionIn();
    }, 0);

    remoteDataService.getMessges(function(err, msgs) {
      $scope.messages = msgs;
    });

    $scope.isAnyFlagged = function() {
      // find meta  
      var foundItem = _.findWhere(remoteDataService.metaData, {flagged: true});        

      if(foundItem !== null && typeof foundItem !== "undefined") {
        return 1;
      } else {
        return 0;
      }
    }

    $scope.isAnyInProgress = function() {
      // find meta  
      var foundItem = _.findWhere(remoteDataService.metaData, {done: true});        

      if(foundItem !== null && typeof foundItem !== "undefined") {
        return 1;
      } else {
        return 0;
      }
    }


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
