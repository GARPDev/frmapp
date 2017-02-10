frmServices.factory('navigationService', ['$resource','$http',
  function($resource, $http){


    var navigationService = {};
    navigationService.currentNav = null;

    navigationService.pageTransitionOut = function(view) {

      console.log(view)

      var currentLoc = document.location.hash;
      var route = null;

      if(currentLoc.indexOf('#!/') > -1) {

        var route = currentLoc.substring(3);

        if(route.indexOf('/') > -1) {

          route = route.substring(0,route.indexOf('?'));

        } else if(route.indexOf('?') > -1) {

          route = route.substring(0,route.indexOf('?'));

        }

      }

      if(route != view){

        navigationService.currentNav = view;

        $('.page-container').fadeOut(function() {
          if(view !== null && typeof view !== "undefined") {
            console.log(view)
            document.location.hash = '#!/' + view;
          }
        });

      }

    }

    navigationService.pageTransitionIn = function() {
      $('.page-container').fadeIn();
    }

    navigationService.changeView = function(view) {
      navigationService.pageTransitionOut(view);
    }


    return navigationService;

  }
]);
