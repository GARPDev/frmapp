frmServices.factory('navigationService', ['$resource','$http',
  function($resource, $http){


    var navigationService = {};
    navigationService.currentNav = null;

    navigationService.pageTransitionOut = function(view) {

      var currentLoc = document.location.hash;
      if(currentLoc.indexOf(view) > -1) {

        //document.location.href = 

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
