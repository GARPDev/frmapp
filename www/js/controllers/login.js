frmControllers.controller('FRMAppLoginCtrl', ['$scope', '$rootScope','$timeout','$location','remoteDataService','navigationService','authenticationService',
  function($scope, $rootScope, $timeout, $location, remoteDataService, navigationService, authenticationService) {

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

      var reloadData = true;
      if(isOnline()) {
        if(defined(localStorage,"wasOffLine")) {
          // Ask User to overwrite server or not!
          if (confirm("You were offline last time you logged in. Do you want this device's changes to be saved? Click OK to save this devices changes to all devices or click Cancel to used changes from last time you were online.")) {
            // will save data on next commit.
            reloadData = false;
          } else {
            // Clear local device data
            remoteDataService.clearData();
          }
          localStorage.removeItem('wasOffLine');   
        } else {
          remoteDataService.clearData();  
        }
      }

      if(reloadData) {

        remoteDataService.examInfo={};
        remoteDataService.examInfo.userExam=null;
        remoteDataService.examInfo.userIsExamCurrent=false;
        remoteDataService.examInfo.examPart=null;
        remoteDataService.examInfo.exam=null;
        remoteDataService.examInfo.EXAM=null;      

        authenticationService.authenticateUser(userName, password, function(err, result) {

          if(!defined(result,"contact")) {
            if(defined(spinner))
              spinner.stop();  
            $('#errormsg').html("Your Email Address and Password combination is not correct.");          
            return;
          }
          var authResult = result;

          if(defined(authenticationService,"user")) {
            remoteDataService.userData = authenticationService.user;
          }

          remoteDataService.getExamRegistrations(result.contact.Id, function(err, result) {

            if(!defined(result,"registrations")) {
              if(defined(spinner))
                spinner.stop();  
              $('#errormsg').html("You are not currently enrolled for an exam.");          
              return;
            }
            var examResult = result;

            remoteDataService.examInfo.regdata = null;
            remoteDataService.examInfo.regdata=[];
            remoteDataService.examInfo.regdataFRM=null;
            remoteDataService.examInfo.regdataERP=null;
            remoteDataService.examInfo.userExamPart=null;
            remoteDataService.examInfo.userExamKPI=null;
            remoteDataService.examInfo.canPick = false;

            // Look at Current Exam Registrations
            if(examResult.registrations.records.length > 0) {
              for(var i=0; i< examResult.registrations.records.length; i++) {
                var examReg = examResult.registrations.records[i];

                if(defined(examReg,"Section__c")) {

                  if(examReg.Section__c.indexOf('FRM') > -1) {
                    remoteDataService.examInfo.regdataFRM = examReg;
                    remoteDataService.examInfo.userIsExamCurrent=true;
                    remoteDataService.examInfo.userIsExamCurrentFRM=true;
                    remoteDataService.examInfo.userExam = remoteDataService.examInfo.regdataFRM;

                  } else if(examReg.Section__c.indexOf('ERP') > -1 ) {
                    remoteDataService.examInfo.regdataERP = examReg;
                    remoteDataService.examInfo.userIsExamCurrent=true;
                    remoteDataService.examInfo.userIsExamCurrentERP=true;
                    remoteDataService.examInfo.userExam = remoteDataService.examInfo.regdataERP;                
                  }

                  remoteDataService.examInfo.regdata.push(examReg);
                  if(examReg.Section__c.indexOf('1') > -1 || examReg.Section__c.indexOf('Part I') > -1) {
                    if(remoteDataService.examInfo.userExamPart == null)
                      remoteDataService.examInfo.userExamPart = 1;
                    else remoteDataService.examInfo.userExamPart = 3;
                  }
                  if(examReg.Section__c.indexOf('2') > -1 || examReg.Section__c.indexOf('Part II') > -1) {
                    if(remoteDataService.examInfo.userExamPart == null)
                      remoteDataService.examInfo.userExamPart = 2;
                    else remoteDataService.examInfo.userExamPart = 3;
                  }
                }
              }            
            }

            if((defined(authResult,"contact.KPI_FRM_Candidate_Payment_Status__c") && authResult.contact.KPI_FRM_Candidate_Payment_Status__c == 'In Good Standing') ||
               (defined(authResult,"contact.KPI_ERP_Candidate_Payment_Status__c") && authResult.contact.KPI_ERP_Candidate_Payment_Status__c == 'In Good Standing')) {

              if(remoteDataService.examInfo.userIsExamCurrentFRM == true) {
                remoteDataService.examInfo.exam = 'frm';
                remoteDataService.examInfo.EXAM = 'FRM';              
              } else if(remoteDataService.examInfo.userIsExamCurrentERP == true) {
                remoteDataService.examInfo.exam = 'erp';
                remoteDataService.examInfo.EXAM = 'ERP';
              } else if(defined(authResult,"contact.KPI_FRM_Candidate_Payment_Status__c") && authResult.contact.KPI_FRM_Candidate_Payment_Status__c == 'In Good Standing' && !defined(authResult,"contact.KPI_ERP_Candidate_Payment_Status__c")) {
                remoteDataService.examInfo.exam = 'frm';
                remoteDataService.examInfo.EXAM = 'FRM';
                if(defined(result,"contact.KPI_Last_Exam_Registration__c") && result.contact.KPI_Last_Exam_Registration__c.indexOf('FRM') > -1)
                  remoteDataService.examInfo.userExamKPI = result.contact.KPI_Last_Exam_Registration__c;
              } else if(defined(authResult,"contact.KPI_ERP_Candidate_Payment_Status__c") && authResult.contact.KPI_ERP_Candidate_Payment_Status__c == 'In Good Standing' && !defined(authResult,"contact.KPI_FRM_Candidate_Payment_Status__c")) {
                remoteDataService.examInfo.exam = 'erp';
                remoteDataService.examInfo.EXAM = 'ERP';
                if(defined(result,"contact.KPI_Last_Exam_Registration__c") && result.contact.KPI_Last_Exam_Registration__c.indexOf('ERP') > -1)
                  remoteDataService.examInfo.userExamKPI = result.contact.KPI_Last_Exam_Registration__c;
              }

              if(remoteDataService.examInfo.userExamKPI != null && remoteDataService.examInfo.userExamPart == null) {
                remoteDataService.examInfo.examPart = 3;
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

              if(remoteDataService.examInfo.userExam==null) {
                remoteDataService.examInfo.canPick = true;
                navigationService.pageTransitionOut('pickexam'); 
              } else {
                navigationService.pageTransitionOut('myaccount'); 
                var obj = $('.spin')
                opts.top = '50px'
                remoteDataService.spinner = new Spinner(opts).spin(obj[0]);
              }
              
              $('.main-container').fadeOut(function() {
                document.location.hash = '#!/myaccount';
              });

              $rootScope.$broadcast('updateNav', true);
            } else {
              if(defined(spinner))
                spinner.stop();  
              $('#errormsg').html("You are not currently enrolled for an exam.");          
              return;            
            }
          });
        });
      } else {
        navigationService.pageTransitionOut('myaccount');
      }
    }
}]);