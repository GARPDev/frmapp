frmControllers.controller('TopicPanelController', ['$scope', '$location', '$timeout', 'Readings', 'Messages','Lessons','scheduleBarSharedService','remoteDataService','authenticationService',
  function($scope, $location, $timeout, Readings, Messages, Lessons, scheduleBarSharedService, remoteDataService, authenticationService) {

    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.scrollIndex = 1;
    $scope.allMode = scheduleBarSharedService.allMode;

    $scope.userExam = authenticationService.user.contact.KPI_Current_Exam_Registration__c;

    // init ScheduleBar
    var lesson = {id:'all', title:'All Readings'};
    if(scheduleBarSharedService.lessonIndex != 'all') {
      if(scheduleBarSharedService.lessonIndex !== null && typeof scheduleBarSharedService.lessonIndex !== "undefined") {
        lesson = remoteDataService.getLessonByID(scheduleBarSharedService.lessonIndex);
      } else {
        lesson = remoteDataService.getFirstLesson();
      }      
    }

    scheduleBarSharedService.lessonIndex = lesson.id;
    $scope.selected = lesson.id;
    scheduleBarSharedService.selectItem(lesson.id);

    $scope.$on('handleTopicSelectItem', function() {
      $scope.selected = scheduleBarSharedService.lessonIndex;
    });

    $scope.$on('changeOrgOption', function() {
      $scope.lessons = remoteDataService.lessonData;
      $scope.readings = $scope.lessons[0].readings;
      $scope.scrollIndex = 1;      
    });

    $scope.itemSelect = function(item) {
      $scope.selected = item;

      var selector = '.spin-area';
      var obj = $(selector)
      if(obj !== null && typeof obj !== "undefined" && obj.length > 0) {
        var spinner = new Spinner(opts).spin(obj[0]);
        $timeout(function() {

            scheduleBarSharedService.selectItem(item);

            $timeout(function() {
              spinner.stop();
             },400);

        },100);
      }

    };


    $scope.isItemSelected = function(item) {
      if(item == $scope.selected) {
        return 1;
      } else {
        return 0;
      }
    };


  }
]);
