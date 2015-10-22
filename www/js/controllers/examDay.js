frmControllers.controller('FRMExamDayCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService','navigationService','mapService',
  function($scope,$timeout,$location,examSharedService,remoteDataService,navigationService,mapService) {

    $('.tab-pane').hide();
    $('#tab1').show();
    $scope.reminderStatus = "";
    $scope.userSession = remoteDataService.userSession;
    $scope.userData = remoteDataService.userData;
    $scope.newReminder = "";
    $scope.regdata = $scope.userData.registeredExam.registrations.records[0];
    $scope.userSettings = remoteDataService.userSettings;

    $scope.isMobile = isMobile();

    $timeout(function() {
      navigationService.pageTransitionIn();
      //$scope.userData.registeredExam.address + " " + $scope.userData.registeredExam.city + ", " + $scope.userData.registeredExam.state + " " + $scope.userData.registeredExam.zip;      
      var address = $scope.regdata.Exam_Site__r.Site__r.Display_Address__c;

      mapService.displayMap('map-canvas',address, function(err, status) {
      });
    }, 0);

    if(navigator.camera === null || typeof navigator.camera === "undefined") {
      $('.add-reminder-area').hide();
    }
    
    $scope.addMyReminder=function() {
      if(!defined(remoteDataService,"userSettings.reminders"))
        remoteDataService.userSettings.reminders = [];
      remoteDataService.userSettings.reminders.push($scope.newReminder);
      remoteDataService.commitData();
      $scope.newReminder = '';
    }

    $scope.removeMyReminder=function(idx) {
      remoteDataService.userSettings.reminders.splice(idx, 1);
      remoteDataService.commitData();
    }

    $scope.copyToDevice =function(idx) {
    
      var reminder= {};
      if(idx > -1) {
        reminder.text = remoteDataService.userSettings.reminders[idx];
        reminder.startDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
      } else {
        
        switch(idx) {
          case -1:
            reminder.text = 'Download Exam Admission Ticket';
            break;
          case -2:
            reminder.text = 'Obtian and register your current non-expired Government Issued Photo ID';
            break;
          case -3:
            reminder.text = 'Verify or aquire an approved Calculator';
            break;
          case -4:
            reminder.text = 'Bring #2 or Hard Black (HB) pencils only';
            break;
        }
      }

      var startDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
      var endDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
      var title = reminder.text;
      var location = $scope.userData.registeredExam.address + " " + $scope.userData.registeredExam.city + ", " + $scope.userData.registeredExam.state + " " + $scope.userData.registeredExam.zip;    
      try {
        if(typeof window.plugins.calendar != "undefined") {
          var notes = ""; 
          var success = function(message) { 
            //alert("Success: " + JSON.stringify(message)); 
            alert("Event Added Successfull on " + getEpochDateShortText(startDate));
          };
          var error = function(message) { alert("Error: " + message); };

          // create an event silently (on Android < 4 an interactive dialog is shown)
          window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
        }
      }
      catch(err) {
          alert("Excpetion: " + err.message);
      }

    }

    $scope.tabToItem = function(item) {
      $('.tab-pane').hide();
      $('#examday-tabs li').removeClass('active');
      $('#' + item).show();
      $('#tab_' + item).addClass('active');
    }

  }
]);
