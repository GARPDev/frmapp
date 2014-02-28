frmControllers.controller('FooterNavController', ['$scope', '$timeout', '$location','remoteDataService','navigationService',
  function($scope, $timeout, $location, remoteDataService, navigationService) {

    $scope.innerWidth = window.innerWidth;
    $scope.innerHeight = window.innerHeight;
    $scope.showFooter = remoteDataService.showFooter;

    var offset = 75; // height of footer in CSS
    if(window.innerWidth  <= minWidth) {
        offset = 50;
        $('.nav-footer').css('height','50px');
        $('.nav-footer-item-text').hide();
        $('.nav-footer-control-off-icon').css('margin-top','15px');
    }

    $('.nav-footer').hide();
    $('.nav-footer-control').hide();
    $('.nav-footer-control-off').hide();
    
    $('#footer').css('top',($scope.innerHeight-offset));
    $('.nav-footer-control').css('top',($scope.innerHeight-offset));
    $('.nav-footer-control-off').css('top',($scope.innerHeight-offset));
    

    // show footer
    //$timeout(function() {
      if(window.innerWidth <= 995) {

        if($scope.showFooter) {
          $('.nav-footer').show();
          $('.nav-footer-control').show();
          $('.nav-footer-control-off').hide();
        } else {
          $('.nav-footer').hide();
          $('.nav-footer-control-off').show();
        }
      }
    //, 300);


    $scope.$on('browserResize', function() {

      $scope.innerWidth = window.innerWidth;
      $scope.innerHeight = window.innerHeight;

      if(window.innerWidth  <= minWidth) {
        offset = 50;
        $('.nav-footer').css('height','50px');
        $('.nav-footer-control-off-icon').css('margin-top','15px');          
        $('.nav-footer-item-text').hide();
      } else {
        offset = 75;
        $('.nav-footer').css('height','75px');
        $('.nav-footer-item-text').show();
      }


      $('#footer').css('top',($scope.innerHeight-offset));
      $('.nav-footer-control').css('top',($scope.innerHeight-offset));
      $('.nav-footer-control-off').css('top',($scope.innerHeight-offset));

      if(window.innerWidth > 995) {
        if($('.nav-footer').css('display') !== "none") {
          $('.nav-footer').hide();
          $('.nav-footer-control-off').hide();
        }
      } else {
        if($('.nav-footer').css('display') === "none") {

          if($scope.showFooter) {
            
            $timeout(function() {
              $('.nav-footer').show("slow", function() {
                $('.nav-footer-control').show("slow");
              });
            }, 1000);

          } else {
            $('.nav-footer-control-off').show("slow");
          }
        }
      }

    });

    $scope.closeFooter = function() {
      $scope.showFooter = remoteDataService.showFooter = false;
      $('.nav-footer').hide("slow");
      $('.nav-footer-control').hide("slow");
      $('.nav-footer-control-off').show("slow");
    }


    $scope.openFooter = function() {
      $scope.showFooter = remoteDataService.showFooter = true;      
      $('.nav-footer-control-off').hide("slow");
      $('.nav-footer').show("slow", function() {
        $('.nav-footer-control').show("slow");
      });
    }

    $scope.changeView = function(view) {
      navigationService.pageTransitionOut(view);
    }
  }


]);