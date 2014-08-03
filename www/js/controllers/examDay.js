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

      if(typeof cordova != "undefined") {
      var cordova = window.plugins.calendar;
    
        var notes = "";
        var success = function(message) { 

          $scope.reminderStatus = "Success: " + message;
          alert($scope.reminderStatus);
          //$scope.userSession.reminderAdded = true;
          remoteDataService.userSession.reminderAdded = true;
          remoteDataService.commitData();
        };
        var error = function(message) { $scope.reminderStatus = "Failure: " + message };      

        //cordova.exec(success, error, "Calendar", "createEvent", [title, location, notes, startDate.getTime(), endDate.getTime()]);
        window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
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
