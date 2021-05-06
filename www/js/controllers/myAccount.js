frmControllers.controller('FRMAppMyAccountCtrl', ['$scope', '$timeout', '$location','remoteDataService','scheduleBarSharedService','navigationService','mapService','$sce','utilitiesService','$rootScope', '$q', 'GarpAnalyticsService',
  function($scope, $timeout, $location, remoteDataService, scheduleBarSharedService, navigationService,mapService,$sce,utilitiesService,$rootScope, $q, GarpAnalyticsService) {

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
    $scope.examInfo = remoteDataService.examInfo;
    $scope.remoteDataService = remoteDataService;
    $scope.util = utilitiesService;

    $scope.lessonIndex = 0;
    $scope.currentLesson = {};
    $scope.mapStatus = "";
    $scope.userImage = $scope.userData.FullPhotoUrl + '?oauth_token=' + $scope.userData.accessToken;


    if(defined(remoteDataService,"examInfo.userExam.Integration_Data_Exam_Scheduled_Date__c")) {
      $scope.examDate = moment(remoteDataService.examInfo.userExam.Integration_Data_Exam_Scheduled_Date__c).format('MMMM D, YYYY');
    } else if(defined(remoteDataService,"examInfo.userExam.RPT_Administration_Month__c")) {
      $scope.examDate = remoteDataService.examInfo.userExam.RPT_Administration_Month__c + " " + remoteDataService.examInfo.userExam.RPT_Administration_Year__c;
    } else {
      $scope.examDate = moment(remoteDataService.examInfo.userExam.Exam_Site__r.Exam__r.Exam_Date__c).format('MMMM D, YYYY');
    }

    var address;
    if(defined(remoteDataService,"examInfo.userExam.Integration_Data_Exam_Location__c")) {
      address = remoteDataService.examInfo.userExam.Integration_Data_Exam_Location__c
    } else if(defined(remoteDataService,"examInfo.userExam.Integration_Data_Exam_Location_Country__c")) {
      address = remoteDataService.examInfo.userExam.Integration_Data_Exam_Location_City__c + ", " + remoteDataService.examInfo.userExam.Integration_Data_Exam_Location_Country__c;
    }  else if(defined(remoteDataService,"examInfo.userExam.Exam_Site__r.Site__r.Display_Address__c")) {
      address = remoteDataService.examInfo.userExam.Exam_Site__r.Site__r.Display_Address__c;
    }    
    $scope.displayAddress = address;

    $scope.orgOptions = [{
          name: 'Week',
          value: 'week'
      }, {
         name: 'Topic',
         value: 'topic'
      }];

    if(defined($scope,"userSettings.organizeBy") && $scope.userSettings.organizeBy == "") {
      $scope.userSettings.organizeBy = 'week';
    }

    $scope.orgOption = _.findWhere($scope.orgOptions, {value: $scope.userSettings.organizeBy })

    $('#map-debug').text($('#map-debug').text()+'Start');

    $timeout(function() {

      $('#map-debug').text($('#map-debug').text()+'Timeout Start');

      navigationService.pageTransitionIn();
      // registeredExam.address + " " + $scope.userData.registeredExam.city + ", " + $scope.userData.registeredExam.state + " " + $scope.userData.registeredExam.zip;    

      if(defined(address)) {
        $('#map-debug').text($('#map-debug').text()+'Call Display Map');

        mapService.displayMap('map-canvas',address, function(err, data) {

          $('#map-debug').text($('#map-debug').text()+'Return from Display Map');

          $scope.mapStatus = mapService.status;  
        });

      }
      
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

    $scope.logout = function() {
      $rootScope.$broadcast('updateNav', false);
      if(isOnline()) {
        remoteDataService.clearData(); 
      }
      navigationService.pageTransitionOut('login');
    }

    $scope.takePhoto = function () { 
      if(navigator.camera !== null && typeof navigator.camera !== "undefined") {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 20, destinationType: Camera.DestinationType.FILE_URI, correctOrientation: true });
      }
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
      navigationService.pageTransitionOut('login');
    }

    $scope.changeOrgOption = function(value) {
      remoteDataService.changeOrgOption(value);
      $scope.$broadcast('changeOrgOption');

      $scope.lessonIndex = 0;      
      var lesson = remoteDataService.getFirstLesson();
      scheduleBarSharedService.selectItem(lesson.id);
    }

    $scope.changeView=function(view) {
      remoteDataService.commitData();
      navigationService.pageTransitionOut(view);
    }

    $scope.changeExam = function(examType) {
      
      if(examType == "erp"){
        remoteDataService.examInfo.exam = 'erp';
        remoteDataService.examInfo.EXAM = 'ERP';
      } else if(examType == "frm"){
        remoteDataService.examInfo.exam = 'frm';
        remoteDataService.examInfo.EXAM = 'FRM';
      }
      
      remoteDataService.examInfo.userExamPart = 3;

      localStorage.removeItem('readingData');
      remoteDataService.readingData = null;

      localStorage.removeItem('questionsReadingsData');
      remoteDataService.questionsReadingsData = null;

      localStorage.removeItem('questionData');
      remoteDataService.questionData = null;

      localStorage.removeItem('glossaryData');
      remoteDataService.glossaryData = null;

      remoteDataService.fetchData($q.defer())
      
    }

  }
]);