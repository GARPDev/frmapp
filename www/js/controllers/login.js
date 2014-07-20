frmControllers.controller('FRMAppLoginCtrl', ['$scope', '$timeout','$location','remoteDataService','navigationService','authenticationService',
  function($scope, $timeout, $location, remoteDataService, navigationService, authenticationService) {

    var localPropRemember = 'frmAppLoginRemember';
    var localPropUserName = 'frmAppLoginUserName';
    var localPropUserPassword = 'frmAppLoginPassword';

    if(localStorage[localPropRemember] == 'null' || typeof localStorage[localPropRemember] === "undefined" || localStorage[localPropRemember] === null) {
      $scope.remember = false;
    } else {
      $scope.remember = localStorage[localPropRemember];
    }

    if($scope.remember) {
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

      var localPropUserName = 'frmAppLoginUserName';
      var localPropUserPassword = 'frmAppLoginPassword';

      if(remember) {
        localStorage[localPropRemember] = true;
        localStorage[localPropUserName] = userName;
        localStorage[localPropUserPassword] = password;
      } else {
        localStorage.removeItem(localPropRemember);
        localStorage.removeItem(localPropUserName);
        localStorage.removeItem(localPropUserPassword);
      }

      localStorage.removeItem('authUser');

      authenticationService.authenticateUser(userName, password, function(err, result) {

        remoteDataService.clearData();

        if(err) {
          $('#errormsg').html("Cannot login!");
        } else {
          navigationService.changeView('myaccount');  
        }

      })
     
    }

  }
]);