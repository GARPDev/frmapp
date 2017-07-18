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


    if(defined($scope,"userData.contact.KPI_Current_Exam_Location__c"))
      $scope.displayAddress = $scope.userData.contact.KPI_Current_Exam_Location__c;    

    if(defined(remoteDataService,"examInfo.userExam.Exam_Site__r.Exam__r.Exam_Date__c"))
      $scope.examDate = moment(remoteDataService.examInfo.userExam.Exam_Site__r.Exam__r.Exam_Date__c).format('MMMM D, YYYY');


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

      if(defined(remoteDataService,"examInfo.userExam.Exam_Site__r")) {
        var address = remoteDataService.examInfo.userExam.Exam_Site__r.Site__r.Display_Address__c;
        if(defined(remoteDataService.examInfo.userExam,"Room__r.Venue__r.Id")) {
          var venue = remoteDataService.examInfo.userExam.Room__r.Venue__r;
          var displayAddress = '';
          if(defined(venue,"Institution_Name__c"))
          displayAddress += venue.Institution_Name__c + "<br>";
          if(defined(venue,"Building_Name__c"))
          displayAddress += venue.Building_Name__c + "<br>";
          if(defined(venue,"Address1__c"))
          displayAddress += venue.Address1__c + "<br>";
          if(defined(venue,"Address2__c"))
          displayAddress += venue.Address2__c + "<br>";
          if(defined(venue,"City__c"))
          displayAddress += venue.City__c + ", ";
          if(defined(venue,"State__c"))
          displayAddress += venue.State__c + "<br>";
          if(defined(venue,"Country__c"))
          displayAddress += venue.Country__c;

          $scope.displayAddress = $sce.trustAsHtml(displayAddress);
          address = venue.Address1__c + ' ' + venue.City__c + ' ' + venue.State__c + ' ' + venue.Country__c;
        }
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
      navigationService.changeView('login');
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
      remoteDataService.commitData();
      navigationService.changeView(view);
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