frmControllers.controller('FRMExamDayCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService','navigationService','mapService',
  function($scope,$timeout,$location,examSharedService,remoteDataService,navigationService,mapService) {

    $('.tab-pane').hide();
    $('#tab1').show();
    $scope.reminderStatus = "";
    $scope.userSession = remoteDataService.userSession;
    $scope.userData = remoteDataService.userData;
    $scope.newReminder = "";
    
    //$scope.isMobile = isMobile();
    $scope.isMobile = true;

    $timeout(function() {
      navigationService.pageTransitionIn();
      var address = $scope.userData.registeredExam.address + " " + $scope.userData.registeredExam.city + ", " + $scope.userData.registeredExam.state + " " + $scope.userData.registeredExam.zip;    
      mapService.displayMap('map-canvas',address);
    }, 0);

    if(navigator.camera === null || typeof navigator.camera === "undefined") {
      $('.add-reminder-area').hide();
    }
    
    $scope.addMyReminder=function() {
      if(!defined(remoteDataService,"userData.settings.reminders"))
        remoteDataService.userData.settings.reminders = [];
      remoteDataService.userData.settings.reminders.push($scope.newReminder);
      remoteDataService.commitData();
      $scope.newReminder = '';
    }

    $scope.removeMyReminder=function(idx) {
      remoteDataService.userData.settings.reminders.splice(idx, 1);
      remoteDataService.commitData();
    }

    $scope.copyToDevice =function(idx) {
    
      var reminder= {};
      if(idx > -1) {
        reminder.text = remoteDataService.userData.settings.reminders[idx];
        reminder.startDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
      } else {
        
        switch(idx) {
          case -1:
            reminder.text = 'Download Exam Admission Ticket';
            reminder.startDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
            break;
          case -2:
            reminder.text = 'Obtian and register your current non-expired Government Issued Photo ID';
            reminder.startDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
            break;
          case -3:
            reminder.text = 'Verify or aquire an approved Calculator';
            reminder.startDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
            break;
          case -4:
            reminder.text = 'Bring #2 or Hard Black (HB) pencils only';
            reminder.startDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
            break;
        }


      }


      if(typeof cordova === "undefined" || cordova === null) {

        $scope.reminderStatus = "Failure: cordova not defined";

      } else {

        var startDate = new Date("December 19, 2013 13:00:00");
        var endDate = new Date("December 19, 2013 14:30:00");
        var title = "FRM App Event";
        var location = "Home";
        var notes = "Some notes about this event.";
        var success = function(message) { 
          $scope.reminderStatus = "Success: " + message;
          //$scope.userSession.reminderAdded = true;
          remoteDataService.userSession.reminderAdded = true;
          remoteDataService.commitData();
        };
        var error = function(message) { $scope.reminderStatus = "Failure: " + message };      

        cordova.exec(success, error, "Calendar", "createEvent", [title, location, notes, startDate.getTime(), endDate.getTime()]);
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
