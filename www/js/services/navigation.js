frmServices.factory('navigationService', ['$resource','$http','$state','$stateParams',
  function($resource, $http, $state, $stateParams){


    var navigationService = {};
    navigationService.currentNav = null;

    navigationService.pageTransitionOut = function(view) {

      if(navigationService.currentNav == view) {
        util.$state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });
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
