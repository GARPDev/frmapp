frmControllers.controller('FRMAppMyAccountCtrl', ['$scope', '$timeout', '$location','remoteDataService','scheduleBarSharedService','navigationService','mapService',
  function($scope, $timeout, $location, remoteDataService, scheduleBarSharedService, navigationService,mapService) {


    if(remoteDataService.userData.registeredExam == null) {
      navigationService.changeView('login');
    }


    $scope.nav = navigator.appCodeName;
    $scope.camera =  navigator.camera;
    $scope.deviceReady =  false;
    $scope.camerror = "";
    $scope.camdata = "";
    $scope.pictureSource = pictureSource;
    $scope.destinationType = destinationType;
    $scope.userData = remoteDataService.userData;
    $scope.lessons = remoteDataService.lessonData;
    $scope.userSettings = remoteDataService.userSettings;

    $scope.lessonIndex = 0;
    $scope.currentLesson = {};

    $scope.mapStatus = "";

    $scope.regdata = $scope.userData.registeredExam.registrations.records[0];

    //$scope.opp = remoteDataService.getOppertunities();

    $scope.orgOptions = [{
          name: 'Week',
          value: 'week'
      }, {
         name: 'Topic',
         value: 'topic'
      }];

    $scope.orgOption = _.findWhere($scope.orgOptions, {value: $scope.userSettings.organizeBy })

    $('#map-debug').text($('#map-debug').text()+'Start');

    $timeout(function() {

      $('#map-debug').text($('#map-debug').text()+'Timeout Start');

      navigationService.pageTransitionIn();
      // registeredExam.address + " " + $scope.userData.registeredExam.city + ", " + $scope.userData.registeredExam.state + " " + $scope.userData.registeredExam.zip;    
      var address = $scope.regdata.Exam_Site__r.Site__r.Display_Address__c;

      $('#map-debug').text($('#map-debug').text()+'Call Display Map');

      mapService.displayMap('map-canvas',address, function(err, data) {

        $('#map-debug').text($('#map-debug').text()+'Return from Display Map');

        $scope.mapStatus = mapService.status;  
      });
      
    }, 0);

    scheduleBarSharedService.allMode = false;

    $scope.$on('handleTopicSelectItem', function() {
      if($scope.lessonIndex != scheduleBarSharedService.lessonIndex) {
        $scope.lessonIndex = scheduleBarSharedService.lessonIndex;
        var lesson = _.findWhere(remoteDataService.lessonData, {id: $scope.lessonIndex});
        $scope.currentLesson = lesson;
      }
    });

    if(remoteDataService.userInfo.photo !== null && typeof remoteDataService.userInfo.photo !== "undefined") {
      $("#myAccountUserImage").attr("src",remoteDataService.userInfo.photo);
    }

    if(navigator.camera === null || typeof navigator.camera === "undefined") {
      $('#takePhoto').hide();
    }

    $scope.takePhoto = function () { 
      if(navigator.camera !== null && typeof navigator.camera !== "undefined") {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 20, destinationType: Camera.DestinationType.FILE_URI, correctOrientation: true });
      }
      // else {
      //   onFail('navigator.camera not defined!');
      // }
    };

    function onPhotoFileSuccess(imageData) {
      $("#userImage").attr("src",imageData);
      $("#myAccountUserImage").attr("src",imageData);
      remoteDataService.userInfo.photo = imageData;
    };

    function onFail(message) {
      $scope.camerror=message;
    };

    $scope.clearData = function() {
      remoteDataService.clearData();
      navigationService.changeView('login');
    }

    $scope.changeOrgOption = function(value) {
      remoteDataService.changeOrgOption(value);
      $scope.$broadcast('changeOrgOption');

      $scope.lessonIndex = 0;      
      var lesson = remoteDataService.getFirstLesson();
      scheduleBarSharedService.selectItem(lesson.id);
    }

    $scope.changeView=function(view) {
      remoteDataService.userSettings = $scope.userSettings;
      remoteDataService.commitData();
      navigationService.changeView(view);
    }

  }
]);