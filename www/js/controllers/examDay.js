frmControllers.controller('FRMExamDayCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService','navigationService','mapService',
  function($scope,$timeout,$location,examSharedService,remoteDataService,navigationService,mapService) {

    $('.tab-pane').hide();
    $('#tab1').show();
    $scope.reminderStatus = "";
    $scope.userSession = remoteDataService.userSession;
    $scope.userData = remoteDataService.userData;
    $scope.newReminder = "";
    
    $scope.isMobile = isMobile();
    alert($scope.isMobile);

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
    
      alert("in1");

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
      alert("in2");

      var startDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
      var endDate = new Date(remoteDataService.userData.registeredExam.registrations.records[0].Exam_Site__r.Exam__r.Exam_Date__c);
      var title = reminder.text;
      var location = $scope.userData.registeredExam.address + " " + $scope.userData.registeredExam.city + ", " + $scope.userData.registeredExam.state + " " + $scope.userData.registeredExam.zip;    

      alert("in3");

      try {
        if(typeof window.plugins.calendar != "undefined") {
          alert("in4");      
          var startDate = new Date(2014,2,15,18,30,0,0,0); // beware: month 0 = january, 11 = december
          var endDate = new Date(2014,2,15,19,30,0,0,0);
          var title = "My nice event";
          var location = "Home";
          var notes = "Some notes about this event.";
          var success = function(message) { alert("Success: " + JSON.stringify(message)); };
          var error = function(message) { alert("Error: " + message); };
          alert("in5"); 
          // create a calendar (iOS only for now)
          var calendarName = "GARP";
          window.plugins.calendar.createCalendar(calendarName,success,error);

          alert("in6"); 

          // if you want to create a calendar with a specific color, pass in a JS object like this:
          var createCalOptions = window.plugins.calendar.getCreateCalendarOptions();
          createCalOptions.calendarName = "My Cal Name";
          createCalOptions.calendarColor = "#FF0000"; // an optional hex color (with the # char), default is null, so the OS picks a color
          window.plugins.calendar.createCalendar(createCalOptions,success,error);
          alert("in7"); 

          // delete a calendar (iOS only for now)
          //window.plugins.calendar.deleteCalendar(calendarName,success,error);

          // create an event silently (on Android < 4 an interactive dialog is shown)
          window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
          alert("in8");
        }
      }
      catch(err) {
          alert(err.message);
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
