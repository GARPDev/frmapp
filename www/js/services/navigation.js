frmServices.factory('navigationService', ['$resource','$http',
  function($resource, $http){


    var navigationService = {};
    navigationService.currentNav = null;

    navigationService.pageTransitionOut = function(view) {

      if(navigationService.currentNav == view) {
        //$scope.reloadPage=$route.reload();
        document.location = document.location;

      } else {
        navigationService.currentNav = view;
        $('.page-container').fadeOut(function() {
          if(view !== null && typeof view !== "undefined") {
            document.location.hash = '#!/' + view;
          }
        });
      }
    }

    navigationService.pageTransitionIn = function() {
      $('.page-container').fadeIn();
      //$('.page-container').show("slide", { direction: "left" }, 500); 
    }

    navigationService.changeView = function(view) {
      navigationService.pageTransitionOut(view);
    }


    return navigationService;

  }
]);
