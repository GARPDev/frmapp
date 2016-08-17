frmControllers.controller('FRMExamDayCtrl', ['$scope','$timeout','$location','examSharedService','remoteDataService','navigationService','mapService','$sce',
  function($scope,$timeout,$location,examSharedService,remoteDataService,navigationService,mapService, $sce) {

    $('.tab-pane').hide();
    $('#tab1').show();
    $scope.reminderStatus = "";
    $scope.userSession = remoteDataService.userSession;
    $scope.userData = remoteDataService.userData;
    $scope.newReminder = "";
    $scope.userSettings = remoteDataService.userSettings;
    $scope.remoteDataService = remoteDataService;

    $scope.isMobile = isMobile();
    $scope.displayAddress = $scope.userData.contact.KPI_Current_Exam_Location__c;

    if($scope.userData.registeredExam.registrations.records.length == 1) {
      $scope.regdata = $scope.userData.registeredExam.registrations.records[0];
    } else {
      if($scope.userData.registeredExam.registrations.records[1].Section__c == 'FRM Part 1') {
        $scope.regdata = $scope.userData.registeredExam.registrations.records[1];
        $scope.regdata1 = $scope.userData.registeredExam.registrations.records[0];
      } else {
        $scope.regdata1 = $scope.userData.registeredExam.registrations.records[1];
        $scope.regdata = $scope.userData.registeredExam.registrations.records[0];
      }
    }
    //$scope.regdata = $scope.userData.registeredExam.registrations.records[0];
    $scope.examDate = moment($scope.regdata.Exam_Site__r.Exam__r.Exam_Date__c).format('MMMM D, YYYY');

    $timeout(function() {
      navigationService.pageTransitionIn();
      //$scope.userData.registeredExam.address + " " + $scope.userData.registeredExam.city + ", " + $scope.userData.registeredExam.state + " " + $scope.userData.registeredExam.zip;      
      var address = $scope.regdata.Exam_Site__r.Site__r.Display_Address__c;
      if(defined($scope.regdata,"Room__r.Venue__r.Id")) {
        var venue = $scope.regdata.Room__r.Venue__r;
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
