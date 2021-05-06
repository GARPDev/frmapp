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
    $scope.regdata1 = null;
    $scope.selectedReg;


    if(remoteDataService.examInfo.regdata.length > 0) {
      if(remoteDataService.examInfo.regdata.length == 1) {
        $scope.regdata = remoteDataService.examInfo.regdata[0];
      } else {
        var section = remoteDataService.examInfo.regdata[1].Section__c;
        if(section.indexOf('1') > -1 || section .indexOf('Part I') > -1) {
          $scope.regdata = remoteDataService.examInfo.regdata[1];
          $scope.regdata1 = remoteDataService.examInfo.regdata[0];
        } else {
          $scope.regdata1 = remoteDataService.examInfo.regdata[1];
          $scope.regdata = remoteDataService.examInfo.regdata[0];
        }
      }
      $scope.selectedReg = 0;

      if(defined($scope,"regdata.Integration_Data_Exam_Scheduled_Date__c")) {
        $scope.examDate = moment($scope.regdata.Integration_Data_Exam_Scheduled_Date__c).format('MMMM D, YYYY');
        $scope.examTime = moment($scope.regdata.Integration_Data_Exam_Scheduled_Date__c).format('hh:mm A');
      } else if(defined($scope,"regdata.RPT_Administration_Month__c")) {
        $scope.examDate = $scope.regdata.RPT_Administration_Month__c + " " + $scope.regdata.RPT_Administration_Year__c;
      } else {
        $scope.examDate = moment($scope.regdata.Exam_Site__r.Exam__r.Exam_Date__c).format('MMMM D, YYYY');
      }

      if(defined($scope,"regdata1")) {
        if(defined($scope,"regdata1.Integration_Data_Exam_Scheduled_Date__c")) {
          $scope.examDate1 = moment($scope.regdata1.Integration_Data_Exam_Scheduled_Date__c).format('MMMM D, YYYY');
          $scope.examTime1 = moment($scope.regdata1.Integration_Data_Exam_Scheduled_Date__c).format('hh:mm A');
        } else if(defined($scope,"regdata.RPT_Administration_Month__c")) {
          $scope.examDate1 = $scope.regdata1.RPT_Administration_Month__c + " " + $scope.regdata1.RPT_Administration_Year__c;
        } else {
          $scope.examDate1 = moment($scope.regdata1.Exam_Site__r.Exam__r.Exam_Date__c).format('MMMM D, YYYY');
        }
      }

      $timeout(function() {
        navigationService.pageTransitionIn();
        var address;
        if(defined($scope.regdata,"Integration_Data_Exam_Location__c")) {
          address = $scope.regdata.Integration_Data_Exam_Location__c
        } else if(defined($scope.regdata,"Integration_Data_Exam_Location_Country__c")) {
          address = $scope.regdata.Integration_Data_Exam_Location_City__c + ", " + $scope.regdata.Integration_Data_Exam_Location_Country__c;
        }  else if(defined($scope.regdata,"Integration_Data_Exam_Location_Country__c")) {
          address = $scope.regdata.Exam_Site__r.Site__r.Display_Address__c;
        }
        $scope.displayAddress = address;

        if(defined($scope,"regdata1")) {
          var address1;
          if(defined($scope.regdata1,"Integration_Data_Exam_Location__c")) {
            address1 = $scope.regdata1.Integration_Data_Exam_Location__c
          } else if(defined($scope.regdata1,"Integration_Data_Exam_Location_Country__c")) {
            address1 = $scope.regdata1.Integration_Data_Exam_Location_City__c + ", " + $scope.regdata1.Integration_Data_Exam_Location_Country__c;
          }  else if(defined($scope.regdata,"Integration_Data_Exam_Location_Country__c")) {
            address1 = $scope.regdata.Exam_Site__r.Site__r.Display_Address__c;
          }
          $scope.displayAddress1 = address1;
        }

        mapService.displayMap('map-canvas',address, function(err, status) {
        });
      }, 0);
    }


    if(navigator.camera === null || typeof navigator.camera === "undefined") {
      $('.add-reminder-area').hide();
    }
    
    $scope.selectedRegMap = function(sel) {
      var address;
      if(sel == 0) {
        address = $scope.displayAddress;
      } else {
        address = $scope.displayAddress1;
      }
      mapService.displayMap('map-canvas',address, function(err, status) {
      });      
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
