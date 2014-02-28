frmControllers.controller('ScheduleBarController', ['$scope', '$location', '$timeout', 'Readings', 'Messages','Lessons','scheduleBarSharedService','remoteDataService',
  function($scope, $location, $timeout, Readings, Messages, Lessons, scheduleBarSharedService, remoteDataService) {

    $scope.lessons = remoteDataService.lessonData;
    $scope.readings = $scope.lessons[0].readings;
    $scope.scrollIndex = 1;
    $scope.allMode = scheduleBarSharedService.allMode;

    $scope.innerWidth = window.innerWidth;
    $scope.innerHeight = window.innerHeight;

    // init ScheduleBar
    if(scheduleBarSharedService.lessonIndex == 'all') {
       var lesson = {id:'all', title:'All Readings'};
    } else {    
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

    $scope.isActive = function (viewLocation) { 
          return viewLocation === $location.path();
      };
    
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

    $scope.scrollRight=function() {
      if($scope.scrollIndex < $scope.lessons.length)
        $scope.scrollIndex++;
    }
    $scope.scrollLeft=function() {
      if($scope.scrollIndex > 0)
        $scope.scrollIndex--;
    }

    $scope.filterMatch = function( criteria ) {
      return function( item ) {
        return (item.order >= $scope.scrollIndex);
      };
    };
    
    $scope.$on('handleDoneReadingItem', function() {
      var li = scheduleBarSharedService.lessonIndex;
      var ri = scheduleBarSharedService.readingIndex;
      
      if($scope.lessons[li].readings[ri].checked) {
        $scope.lessons[li].readings[ri].checked = 0;
      } else {
        $scope.lessons[li].readings[ri].checked = 1;
      }
    });

    $scope.$on('browserResize', function() {
      $scope.innerWidth = window.innerWidth;
      $scope.innerHeight = window.innerHeight;

      // if($scope.innerWidth >= 1200) {
      //     $scope.scrollIndex = 1;
      // }
    });

    $scope.isItemInProgress = function(id) {

      var lesson = _.findWhere(remoteDataService.lessonData, {id: id});

      if(lesson !== null && typeof lesson !== "undefined") {

        var readings = lesson.readings;
        var readingsIds = _.pluck(readings, 'id');

        var meta = _.where(remoteDataService.userMeta, {checked: true});
        if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
          var metaIds = _.pluck(meta, 'id');
          var inter = _.intersection(readingsIds,metaIds)

          if(inter.length > 0)
            return true
          else return false;

        } else {
          return false;
        }

      } else {
        return false;
      }
    };

    $scope.isItemDone = function(id) {
      var lesson = _.findWhere(remoteDataService.lessonData, {id: id});

      if(lesson !== null && typeof lesson !== "undefined") {

        var readings = lesson.readings;
        var readingsIds = _.pluck(readings, 'id');

        var meta = _.where(remoteDataService.userMeta, {checked: true});
        if(meta !== null || typeof meta !== "undefined" && readingsIds !== null && typeof readingsIds !== "undefined") {
          var metaIds = _.pluck(meta, 'id');
          var inter = _.intersection(readingsIds,metaIds)

          if(inter.length == readingsIds.length)
            return true
          else return false;

        } else {
          return false;
        }

      } else {
        return false;
      }
    }
  }
]);
