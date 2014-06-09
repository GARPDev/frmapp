frmControllers.controller('FRMAppLoginCtrl', ['$scope', '$timeout','$location','remoteDataService','navigationService','authenticationService',
  function($scope, $timeout, $location, remoteDataService, navigationService, authenticationService) {

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

    $scope.login = function() {

      var userName = $('#userName').val();
      var password = $('#password').val();

      localStorage.authUser=null;

      authenticationService.authenticateUser(userName, password, function(err, result) {

        remoteDataService.clearData();

        if(err) {
          //navigationService.changeView('myaccount');  
          $('#errormsg').html("Cannot login!");
        } else {
          //$('#errormsg').html("**" + result + "**" + err);
          navigationService.changeView('myaccount');  
        }

      })
     
    }

  }
]);