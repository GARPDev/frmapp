frmControllers.controller('FRMAppLoginCtrl', ['$scope', '$timeout','$location','remoteDataService','navigationService','authenticationService',
  function($scope, $timeout, $location, remoteDataService, navigationService, authenticationService) {

    $scope.autologin = false;

    if(localStorage[localPropRemember] !== 'null' && typeof localStorage[localPropRemember] !== "undefined" && localStorage[localPropRemember] !== null) {
      if(localStorage[localPropRemember] == "true") {
        $scope.autologin = true;  
      } else {
        $scope.autologin = false;  
      }
    }

    if($scope.autologin) {
      $scope.userName = localStorage[localPropUserName];
      $scope.password = localStorage[localPropUserPassword];
    }

    $timeout(function() {
      navigationService.pageTransitionIn();
    }, 0);

    $scope.userAgent = navigator.userAgent;

      if( /Android/i.test(navigator.userAgent) ) {
        $('.input-group-addon').hide();
        $('.login-area').find('div').removeClass('input-group')
      }


    $("video").bind("ended", function() {
       $('.videoplayer').hide("slow");
       $('.videoimage').show("slow");
       $timeout(function() {
          $('.videoplaybutton').show("slow");
       }, 3000);
    });

    $scope.playVideo=function() {
      $('.videoplaybutton').hide("slow");
      $('.videoimage').hide("slow");
      $('.videoplayer').show("slow");
      var video = $('.videoplayer').get(0);
      video.play();
    }

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };



    $scope.login = function(remember) {

      var userName = $('#userName').val().trim();
      var password = $('#password').val().trim();
      //var remember = $('#remember').val();

      var selector = '.login-area';
      var obj = $(selector)
      if(defined(obj) && obj.length > 0) {
        var spinner = new Spinner(opts).spin(obj[0]);
      }      

      var localPropUserName = 'frmAppLoginUserName';
      var localPropUserPassword = 'frmAppLoginPassword';
      var errmsg = "Cannot login";

      authenticationService.authenticateUser(userName, password, function(err, result) {

        if(!defined(result,"contact")) {
          err = 401;
          errmsg = "Your Email Address and Password combonation is not correct.";
        } else if(!defined(result,"contact.KPI_Current_Exam_Registration__c") || (result.contact.KPI_Current_Exam_Registration__c.indexOf('FRM') == -1 && result.contact.KPI_Current_Exam_Registration__c.indexOf('ERP') == -1)) {

          if(defined(result,"contact.KPI_Last_Exam_Date__c") && defined(result,"contact.KPI_Last_Exam_Registration__c") && (result.contact.KPI_Last_Exam_Registration__c.indexOf('FRM') > -1 || result.contact.KPI_Last_Exam_Registration__c.indexOf('ERP') > -1)) {
            var examDate = result.contact.KPI_Last_Exam_Date__c;
            var splitDate = examDate.split(' ');
            if(splitDate.length > 1) {
              var mnow = moment();
              var year = mnow.year().toString();
              if(year == splitDate[1]) {
                result.contact.KPI_Current_Exam_Registration__c = result.contact.KPI_Last_Exam_Registration__c;
                result.contact.KPI_Current_Exam_Date__c = result.contact.KPI_Last_Exam_Date__c;
                result.contact.KPI_Current_Exam_Location__c = result.contact.KPI_Last_Exam_Location__c;
                result.contact.KPI_Current_Exam_Registration_Type__c = result.contact.KPI_Last_Exam_Registration_Type__c;
              } else {
                err = 404;
                errmsg = "You are not currently enrolled for an exam.";
              }
            }
          } else {
            err = 404;
            errmsg = "You are not currently enrolled for an exam.";            
          }

        }

        if(err) {
          if(defined(spinner)) {
            spinner.stop();  
          }
          $('#errormsg').html(errmsg);
        } else {

          // On Web OR Mobile Online
          if(isOnline()) {

            if(defined(localStorage,"wasOffLine")) {
              // Ask User to overwrite server or not!
              if (confirm("You were offline last time you logged in. Do you want this device's changes to be saved? Click OK to save this devices changes to all devices or click Cancel to used changes from last time you were online.")) {
                  // will save data on next commit.
              } else {
                  // Clear local device data
                  remoteDataService.clearData();
              }
              localStorage.removeItem('wasOffLine');   
            } else {
              remoteDataService.clearData();
            }

            if(remember) {
              localStorage[localPropRemember] = true;
              localStorage[localPropUserName] = userName;
              localStorage[localPropUserPassword] = password;
            } else {
              localStorage.removeItem(localPropRemember);
              localStorage.removeItem(localPropUserName);
              localStorage.removeItem(localPropUserPassword);
            }
          }
          navigationService.changeView('myaccount');  
        }

      })
     
    }

  }
]);