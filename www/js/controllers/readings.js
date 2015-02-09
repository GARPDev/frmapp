frmControllers.controller('FRMReadingsCtrl', ['$scope','$timeout','scheduleBarSharedService','remoteDataService','readlingListSharedService','navigationService',
  function($scope, $timeout, scheduleBarSharedService, remoteDataService, readlingListSharedService, navigationService) {
  
    $scope.lessons = remoteDataService.lessonData;
    $scope.lessonIndex = scheduleBarSharedService.lessonIndex;
    if($scope.lessonIndex == 'all') {
      $scope.currentLesson = {id:'all', title:'All Readings'};
    } else {
      $scope.currentLesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
    }
    scheduleBarSharedService.allMode = true;

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);


    $scope.$on('handleTopicSelectItem', function() {
      if($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {

          $scope.lessonIndex = scheduleBarSharedService.lessonIndex;

          if($scope.lessonIndex == 'all') {
            $scope.currentLesson = {id:'all', title:'All Readings'};
          } else {  
            var lesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
            if(lesson !== null && typeof lesson !== "undefined") {          
              $scope.currentLesson = lesson;
            }
          }
      }
    });


    // For Readings
    $scope.selectedReadingArray = [];

    $scope.$on('handleFilterReadingList', function(filterType,value) {
      
      var selector = '.spin-area';
      var obj = $(selector)
      if(obj !== null && typeof obj !== "undefined" && obj.length > 0) {
        var spinner = new Spinner(opts).spin(obj[0]);
        $timeout(function() {
            $timeout(function() {
              spinner.stop();
             },400);

        },100);
      }
    });

    $scope.isFilterOn = function(type) {
      return readlingListSharedService.filters[type];
    }

    $scope.loadData = function(selector) {

    }

  }
]);
