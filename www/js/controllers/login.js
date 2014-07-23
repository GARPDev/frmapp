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

      var userName = $('#userName').val();
      var password = $('#password').val();
      //var remember = $('#remember').val();

      var selector = '.login-area';
      var obj = $(selector)
      if(defined(obj) && obj.length > 0) {
        var spinner = new Spinner(opts).spin(obj[0]);
      }      

      var localPropUserName = 'frmAppLoginUserName';
      var localPropUserPassword = 'frmAppLoginPassword';

      authenticationService.authenticateUser(userName, password, function(err, result) {

        if(err) {
          if(defined(spinner)) {
            spinner.stop();  
          }
          $('#errormsg').html("Cannot login!");
        } else {
          var con = checkConnection();
          // On Web OR Mobile Online
          if(!defined(con) || (defined(con) && con !== Connection.UNKNOWN && con !== Connection.NONE)) {
            localStorage.removeItem('authUser');
            remoteDataService.clearData();
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